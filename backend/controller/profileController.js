import { getUserProfile } from "../storage/profileStorage.js";

/**
 * Get user profile from ATTENDANCE_SHEET
 */
export async function getProfile(req, res) {  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username is required'
    });
  }

  try {
    // Fetch user profile data
    const profileResult = await getUserProfile(username);

    if (!profileResult.found) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: profileResult.user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
