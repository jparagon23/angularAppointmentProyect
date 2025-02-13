import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-selector',
  templateUrl: './tab-selector.component.html',
})
export class TabSelectorComponent {
  @Input() tabs: { label: string; value: string }[] = [];
  @Input() selectedTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tab: string) {
    this.tabChange.emit(tab);
  }
}
