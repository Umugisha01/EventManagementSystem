using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RwandaEventHub.Migrations
{
    /// <inheritdoc />
    public partial class RecordCheckInStaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CheckedInAt",
                table: "Bookings",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CheckedInByStaffId",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CheckedInByStaffId",
                table: "Bookings",
                column: "CheckedInByStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AspNetUsers_CheckedInByStaffId",
                table: "Bookings",
                column: "CheckedInByStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AspNetUsers_CheckedInByStaffId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_CheckedInByStaffId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CheckedInAt",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CheckedInByStaffId",
                table: "Bookings");
        }
    }
}
