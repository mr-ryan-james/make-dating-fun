import { DateTime } from "luxon";

export const formatDate = (unix: number) => {
  const luxon = DateTime.fromMillis(unix);

  console.log("luxon", luxon);

  return luxon.toLocal().toLocaleString(DateTime.DATETIME_MED);
};
