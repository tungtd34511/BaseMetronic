namespace BaseMetronic.Models.Common
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T">type of primary key</typeparam>
    public class EntityCommon<T> : EntityBase<T>
    {
        /// <summary>
        /// Tên
        /// </summary>
        public virtual string Name { get; set; } = string.Empty;
        /// <summary>
        /// Mô tả
        /// </summary>
        public virtual string? Description { get; set; }
    }
}
