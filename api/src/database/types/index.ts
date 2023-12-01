export type DeleteResult = { acknowledged: boolean; deletedCount: number }

export type DeleteResultPromise = Promise<DeleteResult>
