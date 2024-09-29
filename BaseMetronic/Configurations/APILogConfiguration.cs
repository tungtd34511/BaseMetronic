using BaseMetronic.Configurations.Common;
using BaseMetronic.Models.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BaseMetronic.Configurations
{
    public class APILogConfiguration : BaseConfiguration<APILog>
    {
        public override void Configure(EntityTypeBuilder<APILog> builder)
        {
            builder.Property(c => c.Type).HasMaxLength(15);
            builder.HasOne(c => c.Account).WithMany(c => c.APILogs).HasForeignKey(c => c.AccountId).OnDelete(Microsoft.EntityFrameworkCore.DeleteBehavior.ClientSetNull);
            base.Configure(builder);
        }
    }
}
