interface KanbanBoardProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function KanbanBoard({ searchParams }: KanbanBoardProps) {

  const urlSearchParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value !== undefined) {
      urlSearchParams.append(key, value);
    }
  });

  
}
