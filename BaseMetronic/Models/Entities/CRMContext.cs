using BaseMetronic.Utilities.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Reflection;

namespace BaseMetronic.Models.Entities
{
    public class CRMContext : DbContext
    {
        public CRMContext(DbContextOptions<CRMContext> options) : base(options)
        {

        }
        public virtual DbSet<Account> Accounts { get; set; } = null!;
        public virtual DbSet<APILog> APILogs { get; set; } = null!;
        public virtual DbSet<DirectoryItem> DirectoryItems { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDbFunction(typeof(DateTimeExtensions).GetMethod(nameof(DateTimeExtensions.ToCustomString))).HasTranslation(
            e =>
            {
                return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                            e.First(),
                            new SqlFragmentExpression("'dd/MM/yyyy HH:mm:ss'")
                        }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
            });

            modelBuilder.HasDbFunction(typeof(DateTimeExtensions).GetMethod(nameof(DateTimeExtensions.ToDateString))).HasTranslation(
                e =>
                {
                    return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                            e.First(),
                            new SqlFragmentExpression("'dd/MM/yyyy'")
                            }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
                });

            modelBuilder.HasDbFunction(typeof(DateTimeExtensions).GetMethod(nameof(DateTimeExtensions.NullableToCustomString))).HasTranslation(
            e =>
            {
                return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                            e.First(),
                            new SqlFragmentExpression("'dd/MM/yyyy HH:mm:ss'")
                        }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
            });

            modelBuilder.HasDbFunction(typeof(DateTimeExtensions).GetMethod(nameof(DateTimeExtensions.NullableToDateString))).HasTranslation(
                e =>
                {
                    return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                            e.First(),
                            new SqlFragmentExpression("'dd/MM/yyyy'")
                            }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
                });

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}
