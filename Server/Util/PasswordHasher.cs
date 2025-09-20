namespace Server.Util
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    public static class PasswordHasher
    {
        public static string HashPassword(string password, byte[] salt)
        {
            // Generate a random salt using RandomNumberGenerator (replacement for RNGCryptoServiceProvider)
            RandomNumberGenerator.Fill(salt);

            // Create the PBKDF2 hash using SHA256 (recommended)
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(20); // 20-byte hash

            // Combine salt and hash for storage
            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            // Convert to base64 string for storage
            return Convert.ToBase64String(hashBytes);
        }

        public static bool VerifyPassword(string enteredPassword, string storedHash, byte[] salt)
        {
            // Convert stored hash from base64 string to byte array
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            // Extract salt from the stored hash
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Hash the entered password with the extracted salt using SHA256
            var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, 10000, HashAlgorithmName.SHA256);
            byte[] enteredHash = pbkdf2.GetBytes(20);

            // Compare the generated hash with the stored hash
            for (int i = 0; i < 20; i++)
            {
                if (hashBytes[i + 16] != enteredHash[i])
                {
                    return false;
                }
            }
            return true;
        }
    }
}
