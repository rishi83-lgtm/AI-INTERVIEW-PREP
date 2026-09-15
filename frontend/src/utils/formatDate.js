export default function formatDate(value) {
  return new Intl.DateTimeFormat().format(new Date(value));
}
