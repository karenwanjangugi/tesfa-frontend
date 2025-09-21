
const baseUrl= process.env.NEXT_PUBLIC_API_URL

export async function GET() {
 try{
    const response = await fetch(`${baseUrl}/task-assignments/`,
        {
            headers: {
                'Authorization': `Token ${process.env.NEXT_PUBLIC_API_TOKEN}` 
            }
        });


    const result = await response.json();
    return new Response(JSON.stringify(result),{
        status: 200,
    })
} catch (error) {
    return new Response((error as Error).message, {
        status: 500,
    })
}}


export async function POST(request: Request) {

    const bodyData = await request.json();
    const { task, organization } = bodyData;

    if (!task || !organization) {
        return new Response("Missing task or organization field", {
            status: 400,
            });
    }


    try{
        const response = await fetch(`${baseUrl}/task-assignments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`, 
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task,
                    organization,
                    status: 'pending',
                }),
        });


        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: 201,
            statusText: 'Assignment created successfully',
            });
    }catch (error){
        return new Response((error as Error).message, {
            status: 500,
    })

}
}



export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const assignmentId = url.searchParams.get('assignmentId');

        if (!assignmentId) {
            return new Response('Missing assignmentId parameter', { status: 400 });
        }

        const response = await fetch(`${baseUrl}/task-assignments/${assignmentId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            }
        });

        if (!response.ok) {
            return new Response('Failed to delete task assignment', { status: 500 });
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response((error as Error).message, { status: 500 });
    }
}

    
