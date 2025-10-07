import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Location from "@/pages/Location";
import Placement from "@/pages/Placement";
import DeliveryDate from "@/pages/DeliveryDate";
import WasteType from "@/pages/WasteType";
import ExtraItems from "@/pages/ExtraItems";
import SkipSize from "@/pages/SkipSize";
import Providers from "@/pages/Providers";
import Checkout from "@/pages/Checkout";
import Confirmation from "@/pages/Confirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/location" component={Location} />
      <Route path="/placement" component={Placement} />
      <Route path="/delivery-date" component={DeliveryDate} />
      <Route path="/waste" component={WasteType} />
      <Route path="/items" component={ExtraItems} />
      <Route path="/size" component={SkipSize} />
      <Route path="/providers" component={Providers} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmation" component={Confirmation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
