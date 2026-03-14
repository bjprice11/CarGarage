using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class second : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRecords_Vehicles_VehicleId",
                table: "MaintenanceRecords");

            migrationBuilder.DropColumn(
                name: "VechileId",
                table: "MaintenanceRecords");

            migrationBuilder.AlterColumn<int>(
                name: "VehicleId",
                table: "MaintenanceRecords",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRecords_Vehicles_VehicleId",
                table: "MaintenanceRecords",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRecords_Vehicles_VehicleId",
                table: "MaintenanceRecords");

            migrationBuilder.AlterColumn<int>(
                name: "VehicleId",
                table: "MaintenanceRecords",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "VechileId",
                table: "MaintenanceRecords",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRecords_Vehicles_VehicleId",
                table: "MaintenanceRecords",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id");
        }
    }
}
