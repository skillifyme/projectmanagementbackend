import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { sequelizeReady } from './config/database';
import authRoutes from './routes/auth.routes';
import facilityRoutes from './routes/facility.routes';
import programStyleRoutes from './routes/programStyle.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import amenityRoutes from './routes/amenity.routes';
import bookingRoutes from './routes/booking.routes';
import facilityAmenityRoutes from './routes/facilityAmenity.routes';
import homeRoutes from './routes/home.routes';
import locationRoutes from './routes/location.routes';
import programRoutes from './routes/program.routes';
import programServiceRoutes from './routes/programService.routes';
import reviewRoutes from './routes/review.routes';
import userDashboardRoutes from './routes/userDashboard.routes';
import programStyleAmenityRoutes from './routes/programStyleAmenity.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/facilities', facilityRoutes);
app.use('/program-styles', programStyleRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/amenities', amenityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/facility-amenities', facilityAmenityRoutes);
app.use('/home', homeRoutes);
app.use('/locations', locationRoutes);
app.use('/programs', programRoutes);
app.use('/program-services', programServiceRoutes);
app.use('/reviews', reviewRoutes);
app.use('/user-dashboard', userDashboardRoutes);
app.use('/program-style-amenities', programStyleAmenityRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => res.send({ message: 'Welcome to the Wellness API (Node.js)' }));

app.use(errorMiddleware);

sequelizeReady.then(sequelize => {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(process.env.PORT || 4002, () => {
      console.log('Server running on port...');
    });
  });
});
