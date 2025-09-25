
export async function fetchProfile() {

  const token = localStorage.getItem('Token');
  const userId = localStorage.getItem('user_id');

  if (!token) {
    throw new Error('No token found in localStorage.');
  }
  if (!userId) {

    throw new Error('No user ID found in localStorage.');
  }

  try {
    const response = await fetch(`/api/organization?userId=${userId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();

      throw new Error("Make sure to make changes before saving."
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      (error as Error).message || "Invalid response format from server."
    );
  }
}

export async function updateUser(data: any) {
  const token = localStorage.getItem('Token');
  const userId = localStorage.getItem('user_id');

  if (!token) {
    throw new Error('No token found in localStorage.');
  }
  if (!userId) {
    throw new Error('No user ID found in localStorage.');
  }

  try {
    let body;
    let headers: any = {
      Authorization: `Token ${token}`,
    };

    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`/api/organization?userId=${userId}`, {
      method: 'PUT',
      headers,
      body,
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();

      throw new Error("Make sure to make changes before saving.");
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      (error as Error).message || "Invalid response format from server."
    );
  }
}