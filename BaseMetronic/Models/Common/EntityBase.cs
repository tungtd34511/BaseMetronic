namespace BaseMetronic.Models.Common
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T">Primary key</typeparam>
    public class EntityBase<T>
    {
        /// <summary>
        /// Mã
        /// </summary>
        public virtual T Id { get; set; } = default!;
        /// <summary>
        /// Đánh dấu là đã xóa
        /// </summary>
        public virtual bool Active { get; set; } = false;
        /// <summary>
        /// Ngày tạo
        /// </summary>
        public virtual DateTime CreatedTime { get; set; } = DateTime.Now;
    }
}
