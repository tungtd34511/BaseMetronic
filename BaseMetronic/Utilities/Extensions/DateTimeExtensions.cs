namespace BaseMetronic.Utilities.Extensions
{
    public static class DateTimeExtensions
    {
        public static string ToCustomString(this DateTime date)
        {
            return date.ToString("dd/MM/yyyy HH:mm:ss");
        }
        public static string ToDateString(this DateTime date)
        {
            return date.ToString("dd/MM/yyyy");
        }

        public static string NullableToCustomString(this DateTime? date)
        {
            if (date == null)
            {
                return "";
            }
            return date.Value.ToString("dd/MM/yyyy HH:mm:ss");
        }
        public static string NullableToDateString(this DateTime? date)
        {
            if (date == null)
            {
                return "";
            }
            return date.Value.ToString("dd/MM/yyyy");
        }
    }
}
