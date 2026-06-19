import { BrowserRouter, Navigate, Route, type RouteProps, Routes } from 'react-router';
import { type FC } from 'react';
import { MainLayout } from '@/app/layouts/MainLayout.tsx';
import SignInPage from '@/pages/SignIn/ui/SignInPage.tsx';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage.tsx';
import ForgotPassword from '@/pages/ForgotPassword/ui/ForgotPasswordPage.tsx';
import ResetPasswordPage from '@/pages/ForgotPassword/ui/ResetPasswordPage.tsx';
import ProfileScreen from '@/pages/Profile/ui/ProfileScreen.tsx';
import MessagesScreen from '@/pages/Messages/ui/MessagesScreen.tsx';
import { DialogsLayout } from '@/app/layouts/DialogsLayout.tsx';
import { AuthLayout } from '@/app/layouts/AuthLayout.tsx';

import { FollowersPage } from '@/pages/Followers/ui/FollowersPage.tsx';
import { FollowingPage } from '@/pages/Following/ui/FollowingPage.tsx';
import { FeedPage } from '@/pages/Feeds/ui/FeedsPage.tsx';
import { useSelector } from 'react-redux';
import { userIsAuthenticatedSelector } from '@/entities/auth/redux';
import { UsersPage } from '@/pages/Users/ui/UsersPage.tsx';
import OtpPage from '@/pages/Otp/ui/OtpPage.tsx';
import EmailVerification from '@/pages/EmailVerification/ui/EmailVerification.tsx';

const GuestRoute: FC<RouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(userIsAuthenticatedSelector);
  if (isAuthenticated) return <Navigate to="/profile" replace />;
  return children;
};

const ProtectedRoute: FC<RouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(userIsAuthenticatedSelector);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={'/signin'} replace />} />
        <Route element={<MainLayout />}>
          <Route
            path="/signin"
            element={
              <GuestRoute>
                <SignInPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUpPage />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/otp"
            element={
              <GuestRoute>
                <OtpPage />
              </GuestRoute>
            }
          />
          <Route
            path="/email-verification"
            element={
              <GuestRoute>
                <EmailVerification />
              </GuestRoute>
            }
          />
        </Route>
        <Route element={<AuthLayout />}>
          <Route
            path="/profile/:id?"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feeds"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <FollowingPage />
              </ProtectedRoute>
            }
          />
          <Route element={<DialogsLayout />}>
            <Route
              path="/messages/:id?"
              element={
                <ProtectedRoute>
                  <MessagesScreen />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<div>NOT FOUND</div>} />
      </Routes>
    </BrowserRouter>
  );
};
