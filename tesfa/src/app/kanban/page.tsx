interface KanbanBoardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KanbanBoard({ searchParams }: KanbanBoardProps) {
  const resolvedSearchParams = await searchParams;

  const urlSearchParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value !== undefined) {
      urlSearchParams.append(key, value);
    }
  });
}
