using BaseMetronic.Configurations.Common;
using BaseMetronic.Models.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BaseMetronic.Configurations
{
    public class DirectoryItemConfiguration : CommonConfiguration<DirectoryItem>
    {
        public override void Configure(EntityTypeBuilder<DirectoryItem> builder)
        {
            builder.HasOne(c => c.ParentItem).WithMany(c => c.ChildrenItems).HasForeignKey(c => c.ParentId).OnDelete(Microsoft.EntityFrameworkCore.DeleteBehavior.ClientSetNull);
            builder.HasOne(c => c.Account).WithMany(c => c.DirectoryItems).HasForeignKey(c => c.AuthorId).OnDelete(Microsoft.EntityFrameworkCore.DeleteBehavior.ClientSetNull);
            base.Configure(builder);
        }
    }
}
