using BaseMetronic.Models.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BaseMetronic.Configurations.Common
{
    public class BaseConfiguration<T> : IEntityTypeConfiguration<T> where T : EntityBase<int>
    {
        public virtual void Configure(EntityTypeBuilder<T> builder)
        {
            Type type = typeof(T);
            builder.ToTable(type.Name);

            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(1001, 1);

            builder.Property(e => e.Active)
               .HasDefaultValue(false)
               .HasComment("Đánh dấu bị xóa");

            builder.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())")
                .HasComment("Ngày tạo");
        }
    }

    public class CommonConfiguration<T> : BaseConfiguration<T> where T : EntityCommon<int>
    {
        public override void Configure(EntityTypeBuilder<T> builder)
        {

            builder.Property(e => e.Name)
               .HasMaxLength(255);

            builder.Property(e => e.Description)
                .HasMaxLength(500);

            base.Configure(builder);
        }
    }
}
