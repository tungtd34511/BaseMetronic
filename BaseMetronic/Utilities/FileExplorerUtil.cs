namespace BaseMetronic.Utilities
{
    public static class FileExplorerUtil
    {
        public static string DefaultFolderName = "New folder";
        public static string DefaultFileName = "New file";
        /// <summary>
        /// Get Valid Folder full Name
        /// </summary>
        /// <param name="pathFullName"></param>
        /// <returns></returns>
        public static string GetValidFolderName(this string pathFullName)
        {
            string currentFolderName = Path.GetFileName(pathFullName) ?? DefaultFolderName;
            int count = 1;
            string folderPath = Path.GetDirectoryName(pathFullName) ?? "";
            if (string.IsNullOrEmpty(folderPath))
            {
                throw new Exception("Invalid folder Path!");
            }
            string newFolderName = currentFolderName.Trim();
            var invalidPathChars = Path.GetInvalidPathChars();
            foreach (var key in invalidPathChars)
            {
                newFolderName = newFolderName.Replace(key, '-');//Remove all invalid char
            }
            string folderFullName = Path.Combine(folderPath, newFolderName);
            while (Directory.Exists(folderFullName))
            {
                newFolderName = string.Format("{0} ({1})", currentFolderName, count++);
                folderFullName = Path.Combine(folderPath, newFolderName);
            }
            return folderFullName;
        }
        /// <summary>
        /// Get Valid File Name
        /// </summary>
        /// <param name="pathFullName"></param>
        /// <returns></returns>
        public static string GetValidFileName(this string pathFullName)
        {
            string currentfileName = Path.GetFileNameWithoutExtension(pathFullName) ?? DefaultFileName;
            string folderPath = Path.GetDirectoryName(pathFullName) ?? "";
            if (string.IsNullOrEmpty(folderPath))
            {
                throw new Exception("Invalid folder Path!");
            }
            string newFileName = currentfileName.Trim();
            var invalidFileChars = Path.GetInvalidFileNameChars();
            foreach (var key in invalidFileChars)
            {
                newFileName = newFileName.Replace(key, '_');//Remove all invalid char
            }
            return newFileName;
        }
        /// <summary>
        /// Author: TUNGTD
        /// Created: 31/07/2023
        /// Description: convert web path to folder path
        /// </summary>
        /// <param name="path">web format path</param>
        /// <returns></returns>
        public static string GetFolderFormatPath(this string path)
        {
            return path.Replace("/", @"\");
        }
        /// <summary>
        /// Author: TUNGTD
        /// Created: 31/07/2023
        /// Description: convert folder path to web path
        /// </summary>
        /// <param name="path">folder path</param>
        /// <returns></returns>
        public static string GetWebFormatPath(this string path)
        {
            return path.Replace(@"\", "/");
        }
    }
}
