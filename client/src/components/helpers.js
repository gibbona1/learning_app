export function handleResponse(response){
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json()
}