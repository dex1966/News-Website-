export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "vừa xong";

  // Replace space with 'T' to make MySQL datetime string ISO 8601 compliant.
  // MySQL stores datetime in UTC, so we append 'Z' to tell the browser to
  // interpret the value as UTC — NOT local time.
  // (Appending '+07:00' is wrong: 03:09+07:00 = 20:09 prev-day UTC, giving a 7h diff)
  const normalized = dateString.replace(" ", "T");
  const withTz = normalized.includes("+") || normalized.endsWith("Z") ? normalized : normalized + "Z";
  const parsedDate = new Date(withTz);
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
