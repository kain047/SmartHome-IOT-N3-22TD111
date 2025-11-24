const adminController = require('../controllers/adminController');
const { requireSuperAdmin } = require('../middlewares/auth');

router.get('/admin/users', requireSuperAdmin, adminController.userList);
router.delete('/admin/delete-user/:id', requireSuperAdmin, adminController.deleteUser);
router.post('/admin/set-role', requireSuperAdmin, adminController.setRole);
router.post('/admin/reset-password/:id', requireSuperAdmin, adminController.resetPassword);

