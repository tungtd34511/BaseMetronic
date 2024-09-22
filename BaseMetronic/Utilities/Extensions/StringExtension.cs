using System.Security.Cryptography;
using System.Text;

namespace BaseMetronic.Utilities.Extensions
{
    public static class StringExtension
    {
        public static string ToSHA256(this string rawData)
        {
            // Create a SHA256
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2")); // Format as hexadecimal
                }
                return builder.ToString();
            }
        }
    }
}
