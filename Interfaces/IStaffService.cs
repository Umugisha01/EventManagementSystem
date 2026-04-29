using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IStaffService
{
    Task<ApiResponse<StaffAssignment>> AssignStaffAsync(StaffAssignment assignment);
    Task<ApiResponse<IEnumerable<StaffAssignment>>> GetEventStaffAsync(int eventId);
    Task<ApiResponse<IEnumerable<StaffAssignment>>> GetStaffAssignmentsAsync(int staffId);
    Task<ApiResponse<bool>> RemoveStaffAssignmentAsync(int id);
}
