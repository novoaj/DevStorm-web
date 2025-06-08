"use server"
import { cookies } from "next/headers";

const getCookieString = async() => {
  const cookieStore = await cookies();
  let cookieString = "";
  cookieStore.getAll().forEach((cookie) => {
    cookieString += `${cookie.name}=${cookie.value}; `;
  });
  return cookieString.trim();
};

async function getUserData() {
  try {
    const cookie = await getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/user/info`, {
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // 5 minutes cache
        tags: ["user-data"]
      }
    });

    if (!response.ok) {
      console.error(`Error fetching user data: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    };

    const formattedData = {
      username: data.username,
      email: data.email,
      dateJoined: formatDate(data.date_joined),
      projects: data.projects,
      projectsCompleted: data.projects_completed,
    };

    return formattedData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}

async function getUserProjects() {
  try {
    const cookie = await getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/project/by-user`, {
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 180, // 3 minutes cache for more dynamic data
        tags: ["user-projects"]
      }
    });

    if (!response.ok) {
      console.error(`Error fetching user projects: ${response.status} - ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

async function getInitialProjectData(pid: string) {
    try {
        const cookie = await getCookieString();
        
        console.log(`Making request to /api/project/${pid}`);
        
        const response = await fetch(`${process.env.NODE_SERVER_URL}/api/project/${pid}`, {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json',
            },
            next: {
              revalidate: 600, // 10 minutes for project details
              tags: [`project-${pid}`]
            }
        });

        console.log(`Project API response status: ${response.status}`);

        if (response.status === 404) {
            console.log("Project not found (404)");
            return null; 
        }
        
        if (response.status === 403) {
            console.log("Access denied to project (403)");
            return null;
        }
        
        if (!response.ok) {
            console.error(`Unexpected error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Project data successfully fetched");
        return data;
        
    } catch (error) {
        console.error('Failed to fetch project data:', error);
        throw error;
    }
}

async function getInitialTasks(pid: string) {
    try {
        const cookie = await getCookieString();
        
        console.log(`Making request to /api/task/${pid}`);
        
        const response = await fetch(`${process.env.NODE_SERVER_URL}/api/task/${pid}`, {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json',
            },
            next: { 
                revalidate: 30, // 30 seconds for tasks (more dynamic)
                tags: [`tasks-${pid}`]
            }
        });

        console.log(`Tasks API response status: ${response.status}`);

        if (response.status === 404) {
            console.log("Tasks not found, returning empty array");
            return [];
        }

        if (!response.ok) {
            console.error(`Error fetching tasks: ${response.status} - ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        console.log(`Successfully fetched ${data?.length || 0} tasks`);
        return data || [];
        
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return [];
    }
}

export { getInitialProjectData, getInitialTasks, getUserData, getUserProjects };
