import { BrowserRouter, Navigate, Route, type RouteProps, Routes } from 'react-router';
import { type FC } from 'react';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage.tsx';
import ForgotPassword from '@/pages/ForgotPassword/ui/ForgotPasswordPage.tsx';
import ResetPasswordPage from '@/pages/ForgotPassword/ui/ResetPasswordPage.tsx';
import ProfileScreen from '@/pages/Profile/ui/ProfileScreen.tsx';
import MessagesScreen from '@/pages/Messages/ui/MessagesScreen.tsx';
import { AuthLayout } from '@/app/layouts/AuthLayout.tsx';

import { FollowersPage } from '@/pages/Followers/ui/FollowersPage.tsx';
import { FollowingPage } from '@/pages/Following/ui/FollowingPage.tsx';
import { FeedPage } from '@/pages/Feeds/ui/FeedsPage.tsx';
import { DiscoverPage } from '@/pages/Discover/ui/DiscoverPage.tsx';
import { StorePage } from '@/pages/Store/ui/StorePage.tsx';
import { SettingsPage } from '@/pages/Settings/ui/SettingsPage.tsx';
import { useSelector } from 'react-redux';
import { userIsAuthenticatedSelector } from '@/entities/auth';
import { UsersPage } from '@/pages/Users/ui/UsersPage.tsx';
import OtpPage from '@/pages/Otp/ui/OtpPage.tsx';
import EmailVerification from '@/pages/EmailVerification/ui/EmailVerification.tsx';
import LandingPage from '@/pages/Landing/ui/LandingPage.tsx';
import SignInPage from '@/pages/SignIn/ui/SignInPage.tsx';

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
        <Route
          path="/"
          element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          }
        />
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
          path="/email-verification"
          element={
            <GuestRoute>
              <EmailVerification />
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
            path="/discover"
            element={
              <ProtectedRoute>
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/:id"
            element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
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
          <Route
            path="/messages/:id?"
            element={
              <ProtectedRoute>
                <MessagesScreen />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<div>NOT FOUND</div>} />
      </Routes>
    </BrowserRouter>
  );
};
