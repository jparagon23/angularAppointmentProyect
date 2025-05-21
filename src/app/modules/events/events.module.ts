import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { CreateEventPageComponent } from './pages/create-event-page/create-event-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventsPageComponent,
    EventPageComponent,
    CreateEventPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventsRoutingModule,
    SharedModule,
  ],
})
export class EventsModule {}
