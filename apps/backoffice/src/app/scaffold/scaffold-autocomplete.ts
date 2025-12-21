import {Combobox, ComboboxInput, ComboboxPopupContainer} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
import {OverlayModule} from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'bo-scaffold-autocomplete',
  template: `<div ngCombobox filterMode="auto-select">
    <div #origin class="autocomplete">
      <div class="input-group mb-3">
        <span class="input-group-text">
          <span class="bi bi-search" aria-label="search"></span>
        </span>
        <input
          autocomplete="off"
          type="search"
          class="fwe form-control"
          style="border-bottom: 2px solid red"
          aria-label="Label dropdown"
          placeholder="Select a country"
          [(ngModel)]="query"
          ngComboboxInput
        />
      </div>



    </div>
    <ng-template ngComboboxPopupContainer>
      <ng-template
        [cdkConnectedOverlay]="{origin, usePopover: 'inline', matchWidth: true}"
        [cdkConnectedOverlayOpen]="true"
      >
        <div class="popup">
          @if (countries().length === 0) {
            <div class="no-results">No results found</div>
          }
          <div ngListbox>
            @for (country of countries(); track country) {
              <div ngOption [value]="country" [label]="country">
                <span class="option-label">{{ country }}</span>
                <span class="bi bi-check"></span>
              </div>
            }
          </div>
        </div>
      </ng-template>
    </ng-template>
  </div>`,
  styles: [`
    .autocomplete {
      display: flex;
      position: relative;
      align-items: center;
    }
    [ngComboboxInput] {
      padding: 0.75rem 0.5rem 0.75rem 2.5rem;
      //color: var(--bs-primary-color);
      //outline-color: var(--bs-danger-color);
      //border: 1px solid var(--bs-secondary-color);
      background-color: var(--bs-white-color);
    }
    [ngComboboxInput]::placeholder {
      color: var(--bs-primary-color);
    }
    [ngCombobox]:has([aria-expanded='false']) .popup {
      display: none;
    }
    .popup {
      width: 100%;
      //margin-top: 8px;
      //padding: 0.5rem;
      background-color: var(--bs-white);
      //font-size: 0.9rem;
      box-shadow: 2px 3px 21px -4px rgba(0,0,0,0.59);
    }
    .no-results {
      padding: 1rem;
    }
    [ngListbox] {
      gap: 2px;
      height: 100%;
      display: flex;
      overflow: auto;
      flex-direction: column;
    }
    [ngOption] {
      display: flex;
      cursor: pointer;
      align-items: center;
      margin: 1px;
      padding: 0 1rem;
      //min-height: 2.25rem;
      //border-radius: 0.5rem;
    }
    [ngOption]:hover {
      background-color: color-mix(in srgb, var(--bs-orange) 5%, transparent);
    }
    [ngOption][data-active='true'] {
      outline-offset: -2px;
      //outline: 2px solid var(--bs-pink);
    }
    [ngOption][aria-selected='true'] {
      color: var(--hot-pink);
      background-color: color-mix(in srgb, var(--bs-pink) 5%, transparent);
    }
    [ngOption]:not([aria-selected='true']) .check-icon {
      display: none;
    }
    .option-label {
      flex: 1;
    }
    `],
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaffoldAutocomplete {
  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);
  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);
  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);
  /** The query string used to filter the list of countries. */
  query = signal('');
  /** The list of countries filtered by the query. */
  countries = computed(() =>
    ALL_COUNTRIES.filter((country) => country.toLowerCase().startsWith(this.query().toLowerCase())),
  );
  constructor() {
    // Scrolls to the active item when the active option changes.
    // The slight delay here is to ensure animations are done before scrolling.
    afterRenderEffect(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({block: 'nearest'}), 50);
    });
    // Resets the listbox scroll position when the combobox is closed.
    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }
}
const ALL_COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia (Czech Republic)',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini (fmr. ""Swaziland"")',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (formerly Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];
