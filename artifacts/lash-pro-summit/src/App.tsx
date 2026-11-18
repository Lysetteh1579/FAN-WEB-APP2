import { useEffect, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { dark } from '@clerk/themes';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import {
  useGetSummitAccess,
  getGetSummitAccessQueryKey,
  type SummitAccess,
} from '@workspace/api-client-react';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const ROSE = '#F4C2C2';
const GOLD = '#D4AF37';
const TEXT = '#F5F5F5';
const MUTED = '#C9BFBF';
const CARD = '#1A1A1A';

const clerkAppearance = {
  theme: dark,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: ROSE,
    colorForeground: TEXT,
    colorMutedForeground: MUTED,
    colorDanger: '#FF8A80',
    colorBackground: CARD,
    colorInput: '#121212',
    colorInputForeground: TEXT,
    colorNeutral: TEXT,
    colorPrimaryForeground: '#0D0D0D',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: '0.6rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: {
      backgroundColor: CARD,
      border: '1px solid rgba(212,175,55,0.28)',
      borderRadius: '18px',
      width: '440px',
      maxWidth: '100%',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -30px rgba(0,0,0,0.8)',
    },
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: {
      color: TEXT,
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
      fontSize: '1.6rem',
    },
    headerSubtitle: { color: MUTED },
    socialButtonsBlockButtonText: { color: TEXT },
    formFieldLabel: { color: TEXT, fontWeight: 500 },
    footerActionLink: { color: ROSE, fontWeight: 600 },
    footerActionText: { color: MUTED },
    dividerText: { color: MUTED },
    identityPreviewEditButton: { color: ROSE },
    identityPreviewText: { color: TEXT },
    formFieldSuccessText: { color: '#A8E6B8' },
    formFieldErrorText: { color: '#FF8A80' },
    formFieldHintText: { color: MUTED },
    formResendCodeLink: { color: ROSE },
    alertText: { color: TEXT },
    logoBox: { justifyContent: 'center', height: '52px' },
    logoImage: { width: '52px', height: '52px' },
    socialButtonsBlockButton: { borderColor: 'rgba(212,175,55,0.28)' },
    formButtonPrimary: {
      backgroundColor: ROSE,
      color: '#0D0D0D',
      fontWeight: 600,
      minHeight: '44px',
      boxShadow: 'none',
    },
    formFieldInput: {
      backgroundColor: '#121212',
      color: TEXT,
      borderColor: 'rgba(245,245,245,0.22)',
      minHeight: '44px',
    },
    footerAction: { justifyContent: 'center' },
    dividerLine: { backgroundColor: 'rgba(212,175,55,0.28)' },
    alert: {
      backgroundColor: 'rgba(255,138,128,0.1)',
      border: '1px solid rgba(255,138,128,0.4)',
    },
    otpCodeFieldInput: {
      backgroundColor: '#121212',
      color: TEXT,
      borderColor: 'rgba(245,245,245,0.3)',
    },
    formFieldRow: {},
    main: {},
  },
};

function Lashline() {
  return (
    <svg className="lps-lashline" viewBox="0 0 1200 400" aria-hidden="true">
      <defs>
        <linearGradient id="lpsg" x1="0" x2="1">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset=".5" stopColor={GOLD} />
          <stop offset="1" stopColor={ROSE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M40 300 Q600 -40 1160 300" fill="none" stroke="url(#lpsg)" strokeWidth="1" />
      <g stroke="url(#lpsg)" strokeWidth="0.8" strokeLinecap="round" fill="none">
        <path d="M150 232 Q120 170 90 140" /><path d="M230 186 Q210 120 180 86" />
        <path d="M320 150 Q310 80 290 44" /><path d="M420 124 Q420 54 410 16" />
        <path d="M520 110 Q528 40 524 2" /><path d="M600 106 Q612 36 616 0" />
        <path d="M680 110 Q700 40 712 4" /><path d="M780 124 Q806 56 828 18" />
        <path d="M880 150 Q912 84 944 48" /><path d="M970 186 Q1006 124 1042 92" />
        <path d="M1050 232 Q1090 176 1124 148" />
      </g>
    </svg>
  );
}

function Home() {
  return (
    <main className="lps-gate" id="main">
      <Lashline />
      <div className="lps-gate-inner">
        <p className="lps-eyebrow lps-reveal">Private access</p>
        <h1 className="lps-title lps-reveal" data-testid="text-gate-title">
          Lash Pro <em>Summit</em>
          <span className="yr">2026</span>
        </h1>
        <p className="lps-lede lps-reveal">
          Sign in to access the event website.
          New here? Anyone can create an account.
        </p>
        <div className="lps-actions lps-reveal">
          <Link href="/sign-in" className="lps-btn lps-btn-primary" data-testid="link-sign-in">
            Sign in
          </Link>
          <Link href="/sign-up" className="lps-btn lps-btn-ghost" data-testid="link-sign-up">
            Create an account
          </Link>
        </div>
        <p className="lps-fine lps-reveal">Account access is separate from event registration.</p>
      </div>
    </main>
  );
}

function SignInPage() {
  return (
    <main className="lps-auth" id="main">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      <Link href="/" className="lps-back" data-testid="link-back-home">Back to entrance</Link>
    </main>
  );
}

function SignUpPage() {
  return (
    <main className="lps-auth" id="main">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      <Link href="/" className="lps-back" data-testid="link-back-home">Back to entrance</Link>
    </main>
  );
}

function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      className="lps-btn lps-btn-ghost lps-btn-sm"
      onClick={() => signOut({ redirectUrl: basePath || '/' })}
      data-testid="button-sign-out"
    >
      Sign out
    </button>
  );
}

function UserPortalPage() {
  const access = useGetSummitAccess<SummitAccess>({
    query: {
      queryKey: getGetSummitAccessQueryKey(),
      retry: false,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    },
  });

  const status = (access.error as { status?: number } | null)?.status;
  const granted = access.data?.authenticated === true && !access.isError;

  let body;
  if (granted) {
    body = (
      <iframe
        className="lps-frame"
        src="/api/summit/content/"
        title="Lash Pro Summit event website"
        data-testid="frame-summit"
      />
    );
  } else if (access.isPending) {
    body = (
      <div className="lps-state" role="status" aria-live="polite" data-testid="status-access-loading">
        <div className="lps-pulse" aria-hidden="true" />
        <p>Checking your access&hellip;</p>
      </div>
    );
  } else {
    const unauth = status === 401 || access.data?.authenticated === false;
    body = (
      <div className="lps-state" role="alert" data-testid="status-access-error">
        <h1>{unauth ? 'Your session needs a refresh' : 'We could not open the summit'}</h1>
        <p>
          {unauth
            ? 'We could not confirm your sign-in. Try again, or sign out and sign back in.'
            : 'Something interrupted the connection. Please try again in a moment.'}
        </p>
        <button
          type="button"
          className="lps-btn lps-btn-primary"
          onClick={() => access.refetch()}
          disabled={access.isFetching}
          data-testid="button-retry-access"
        >
          {access.isFetching ? 'Checking\u2026' : 'Try again'}
        </button>
      </div>
    );
  }

  return (
    <div className="lps-portal">
      <header className="lps-bar" aria-label="Summit access">
        <div className="lps-brand">
          <img src={`${basePath}/logo.svg`} alt="" />
          <span>Lash Pro <em>Summit</em></span>
          <small>Private access</small>
        </div>
        <LogoutButton />
      </header>
      {body}
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/user-portal" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function UserPortal() {
  return (
    <>
      <Show when="signed-in">
        <UserPortalPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/user-portal`}
      signUpFallbackRedirectUrl={`${basePath}/user-portal`}
      afterSignOutUrl={basePath || '/'}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to take your seat at Lash Pro Summit',
          },
        },
        signUp: {
          start: {
            title: 'Join the summit',
            subtitle: 'Create your account for Lash Pro Summit 2026',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <a href="#main" className="lps-skip">Skip to content</a>
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/user-portal" component={UserPortal} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
