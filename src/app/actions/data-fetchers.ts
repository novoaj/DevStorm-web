import { cookies } from "next/headers";

const getCookieString = () => {
  const cookieStore = cookies();
  let cookieString = "";
  cookieStore.getAll().forEach((cookie) => {
    cookieString += `${cookie.name}=${cookie.value}; `;
  });
  return cookieString;
};

async function getUserData() {
  try {
    const cookie = getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/user/info`, {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
      next: {
        revalidate: 120, // revalidate every 30 seconds
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
    const cookie = getCookieString();
    
    const response = await fetch(`${process.env.NODE_SERVER_URL}/api/project/by-user`, {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
      next: {
        revalidate: 120,
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

// Fix the other functions too
async function getInitialProjectData(pid: string) {
    try {
        const cookie = getCookieString();
        
        const response = await fetch(`${process.env.NODE_SERVER_URL}/api/project/${pid}`, {
            method: 'GET',
            headers: {
                Cookie: cookie,
            },
            next: {
              revalidate: 300,
              tags: [`project-${pid}`]
            }
        });

        if (!response.ok) {
            console.error(`Error fetching project data: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch project data:', error);
        return null;
    }
}

async function getInitialTasks(pid: string) {
    try {
        const cookie = getCookieString();
        
        const response = await fetch(`${process.env.NODE_SERVER_URL}/api/task/${pid}`, {
            method: 'GET',
            headers: {
                Cookie: cookie,
            },
            next: { 
                revalidate: 60, // 1 minute
                tags: [`tasks-${pid}`]
            }
        });

        if (!response.ok) {
            console.error(`Error fetching tasks: ${response.status} - ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return [];
    }
}

export { getInitialProjectData, getInitialTasks, getUserData, getUserProjects };
