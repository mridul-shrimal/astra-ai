import AppRoutes from "./routes/AppRoutes";
import useAutoLock from "./hooks/useAutoLock";
import AppLockOverlay from "./components/lock/AppLockOverlay";

function App() {
  const { locked, setLocked } = useAutoLock();

  return (
    <>
      {locked && (
        <AppLockOverlay
          onUnlock={() => setLocked(false)}
        />
      )}

      <AppRoutes />
    </>
  );
}

export default App;