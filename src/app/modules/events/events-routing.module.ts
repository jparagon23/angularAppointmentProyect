import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventPageComponent } from "./pages/event-page/event-page.component";
import { CreateEventPageComponent } from "./pages/create-event-page/create-event-page.component";

const routes: Routes = [
  {
    path: '',
    component: CreateEventPageComponent,
  },
  {
    path: ':id',
    component: EventPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}