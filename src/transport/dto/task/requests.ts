export interface CreateTaskBody{
    userId: number,
    title: string,
    description: string,
    status?: string,
    priority?: string
}

export interface UpdateTaskBody{
    title?: string
    description?: string 
    status?: string
    priority?: string
}

export interface TaskParams{
    id: string
}

export interface GetTasksQuery{
    userId: string,
    status?: string,
    priority?: string
}