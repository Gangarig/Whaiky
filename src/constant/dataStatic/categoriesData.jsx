import brush from '../../assets/icons/brush.png';
import energy from '../../assets/icons/energy.png';
import fire from '../../assets/icons/fire.png';
import brush2 from '../../assets/icons/brush2.png';
import home from '../../assets/icons/home.png';
import sapling from '../../assets/icons/sapling.png';
import shaver from '../../assets/icons/shaver.png';
import thermometer from '../../assets/icons/thermometer.png';
import tool from '../../assets/icons/tool.png';
import truck from '../../assets/icons/truck.png';
import category from '../../assets/icons/category.png';




export const categoriesData = [
  {
    id: 1,
    text: 'Home Improvement',
    icon: home,
    options: [
      { optionId: 1, text: 'Flooring installation and repair' },
      { optionId: 2, text: 'Kitchen and bathroom remodeling' },
      { optionId: 3, text: 'Window and door installation and repair' },
      { optionId: 4, text: 'Basement and attic finishing' },
    ],
  },
  {
    id: 2,
    text: 'Cleaning Services',
    icon: brush,
    options: [
      { optionId: 5, text: 'Residential and commercial cleaning' },
      { optionId: 6, text: 'Carpet and upholstery cleaning' },
      { optionId: 7, text: 'Pressure washing' },
      { optionId: 8, text: 'Window cleaning' },
    ],
  },
  {
    id: 3,
    text: 'HVAC Services',
    icon: fire,
    options: [
      { optionId: 9, text: 'Heating and cooling preparation' },
      { optionId: 10, text: 'Air duct maintenance' },
      { optionId: 11, text: 'Thermostat repair' },
      { optionId: 12, text: 'Air quality improvement' },
    ],
  },
  {
    id: 4,
    text: 'Painting Services',
    icon: brush2,
    options: [
      { optionId: 13, text: 'Interior and exterior painting' },
      { optionId: 14, text: 'Faux painting' },
      { optionId: 15, text: 'Pressure washing' },
      { optionId: 16, text: 'Window cleaning' },
    ],
  },
  {
    id: 5,
    text: 'Electrical Services',
    icon: energy,
    options: [
      { optionId: 17, text: 'Lighting installation and repair' },
      { optionId: 18, text: 'Wiring and Rewiring' },
      { optionId: 19, text: 'Electrical panel installation and upgrade' },
      { optionId: 20, text: 'Generator installation and repair' },
    ],
  },
  {
    id: 6,
    text: 'Water Heater Services',
    icon: thermometer,
    options: [
      { optionId: 21, text: 'Residential and commercial cleaning' },
      { optionId: 22, text: 'Carpet and upholstery cleaning' }  ,
      { optionId: 23, text: 'Cabinet refinishing and painting' },
      { optionId: 24, text: 'Deck and fence painting and staining' },
    ],
  },
  {
    id: 7,
    text: 'Plumbing Services',
    icon: shaver,
    options: [
      { optionId: 25, text: 'Pipe repair and installation' },
      { optionId: 26, text: 'Water heater installation and repair' },
      { optionId: 27, text: 'Toilet installation and repair' },
      { optionId: 28, text: 'Drain cleaning and repair' },
    ],
  },
  {
    id: 8,
    text: 'Moving Services',
    icon: truck,
    options: [
      { optionId: 29, text: 'Local and long-distance moving' },
      { optionId: 30, text: 'Packing and unpacking' },
      { optionId: 31, text: 'Furniture assembly and disassembly' },
      { optionId: 32, text: 'Storage services' },
    ],
  },
  {
    id: 9,
    text: 'Landscaping Services',
    icon: sapling,
    options: [
      { optionId: 33, text: 'Lawn care and maintenance' },
      { optionId: 34, text: 'Tree trimming and removal' },
      { optionId: 35, text: 'Irrigation system installation and repair' },
      { optionId: 36, text: 'Landscape design and installation' },
    ],
  },
  {
    id: 10,
    text: 'General Services',
    icon: tool,
    options: [
      { optionId: 37, text: 'General home repairs and maintenance' },
      { optionId: 38, text: 'Carpentry services' },
      { optionId: 39, text: 'Drywall repair and installation' },
      { optionId: 40, text: 'Gutter cleaning and repair' },
    ],
  },
  {
    id: 11,
    text: 'Other Services',
    icon: category,
    options: [
      { optionId: 41, text: 'Other Services' },
    ],
  },
];
