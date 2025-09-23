const baseUrl = process.env.BASE_URL;


export async function POST(request: Request) {
 try {
   const body = await request.json();
   const { org_name, email, password, password2, role } = body;
   if (!org_name || !email || !password || !password2) {
     return new Response(
       "Missing required values: org_name, email, password, password2",
       { status: 400 }
     );
   }
   const response = await fetch(`${baseUrl}/users/register/`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ org_name, email, password, password2, role }),
   });
   if (!response.ok) {
     throw new Error("Registration failed: " + response.statusText);
   }
   
   const result = await response.json();
   return new Response(JSON.stringify(result), {
     status: 201,
     statusText: "User registered successfully",
   });
 } catch (error) {
   return new Response("Failed to register: " + (error as Error).message, {
     status: 500,
   });
 }
}
