using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Services;

public class StaffService : IStaffService
{
    private readonly AppDbContext _context;

    public StaffService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<StaffAssignment>> AssignStaffAsync(StaffAssignment assignment)
    {
        _context.StaffAssignments.Add(assignment);
        await _context.SaveChangesAsync();
        return ApiResponse<StaffAssignment>.Created(assignment);
    }

    public async Task<ApiResponse<IEnumerable<StaffAssignment>>> GetEventStaffAsync(int eventId)
    {
        var staff = await _context.StaffAssignments
            .Where(sa => sa.EventId == eventId)
            .Include(sa => sa.Staff)
            .ToListAsync();
        return ApiResponse<IEnumerable<StaffAssignment>>.Ok(staff);
    }

    public async Task<ApiResponse<bool>> RemoveStaffAssignmentAsync(int id)
    {
        var assignment = await _context.StaffAssignments.FindAsync(id);
        if (assignment == null) return ApiResponse<bool>.NotFound();
        
        _context.StaffAssignments.Remove(assignment);
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Staff unassigned successfully");
    }

    public async Task<ApiResponse<IEnumerable<StaffAssignment>>> GetStaffAssignmentsAsync(int staffId)
    {
        var assignments = await _context.StaffAssignments
            .Where(sa => sa.StaffId == staffId && sa.IsActive)
            .Include(sa => sa.Event)
                .ThenInclude(e => e.Venue)
            .ToListAsync();
        return ApiResponse<IEnumerable<StaffAssignment>>.Ok(assignments);
    }
}
