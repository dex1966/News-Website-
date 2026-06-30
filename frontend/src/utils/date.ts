export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "vừa xong";

  // Replace space with 'T' to make MySQL datetime string ISO 8601 compliant
  const parsedDate = new Date(dateString.replace(" ", "T"));
  if (isNaN(parsedDate.getTime())) {
    return "vừa xong";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} tiếng trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  return `${Math.floor(diffInMonths / 12)} năm trước`;
}
