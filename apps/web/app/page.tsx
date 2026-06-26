import { auth } from '@/auth';
import { LandingPage } from './LandingPage';

export default async function HomePage() {
  const session = await auth();
  return <LandingPage isLoggedIn={!!session} />;
}
