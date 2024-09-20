using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseMetronic.Migrations
{
    public partial class update_entity_v10001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Active",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false,
                comment: "Đánh dấu bị xóa",
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValueSql: "((1))",
                oldComment: "Đánh dấu bị xóa");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Active",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValueSql: "((1))",
                comment: "Đánh dấu bị xóa",
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false,
                oldComment: "Đánh dấu bị xóa");
        }
    }
}
