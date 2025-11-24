import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import IntroPage from "@/pages/intro";

function AppRouter() {
  // For local development, use empty base path
  // For production (GitHub Pages), use /Wedding base path
  const isDev = import.meta.env.DEV;
  const basePath = isDev ? '' : '/Wedding';
  
  return (
    <Router base={basePath}>
      <Switch>
        <Route path="/" component={IntroPage} />
        <Route path="/home" component={Home} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;