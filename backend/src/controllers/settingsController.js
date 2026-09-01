import { User } from '../models/User.js';

// @desc    Get user settings & preferences
// @route   GET /api/settings
export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile, preferences, currency, or password
// @route   PUT /api/settings
export const updateSettings = async (req, res, next) => {
  try {
    const { name, currency, avatar, preferences, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (currency) user.currency = currency;
    if (avatar !== undefined) user.avatar = avatar;

    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password',
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};
