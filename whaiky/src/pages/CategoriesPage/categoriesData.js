// categoriesData.js

import houseIcon from '../../assets/icon/house-icon.png';
import cosmeticBrush from '../../assets/icon/cosmetic-brush.png';
import fireTwo from '../../assets/icon/fire-two.png';
import formatBrush from '../../assets/icon/format-brush.png';
import energySocket from '../../assets/icon/energy-socket.png';
import sapling from '../../assets/icon/sapling.png';
import shaver from '../../assets/icon/shaver.png';
import thermometer from '../../assets/icon/thermometer.png';
import tool from '../../assets/icon/tool.png';
import truck from '../../assets/icon/truck.png';

export const categoriesData = [
  {
    id: 1,
    icon: houseIcon,
    text: 'Home Improvement',
    options: ['Flooring installation and repair', 'Kitchen and bathroom remodeling', 'Window and door installation and repair','Basement and attic finishing'],
  },
  {
    id: 2,
    icon: cosmeticBrush,
    text: 'Cleaning Services',
    options: ['Residential and commercial cleaning', 'Carpet and upholstery cleaning', 'Pressure washing','Window cleaning'],
  },
  {
    id: 3,
    icon: fireTwo,
    text: 'HVAC Services',
    options: ['Heating and cooling reperation', 'Air duct maintnance', 'Thermostat repair','Air quality improvement'],
  },
  {
    id: 4,
    icon: formatBrush,
    text: 'Painting Services',
    options: ['Interior and exterior painting', 'Faux painting', 'Pressure washing','Window cleaning'],
  },
  {
    id: 5,
    icon: energySocket,
    text: 'Electrical Services',
    options: ['Lighting installation and repair', 'Writing and Rewriting', 'Electrical panel installation and upgrade','Generator installation and repair'],
  },
  {
    id: 6,
    icon: thermometer,
    text: 'Water Heater Services',
    options: ['Residential and commercial cleaning', 'Carpet and upholstery cleaning', 'Cabinet refinishing and painting','Deck and fence painting and staining'],
  },
  {
    id: 7,
    icon: shaver,
    text: 'Plumbing Services',
    options: ['Pipe repair and installation', 'Water heater installation and repair', 'Toilet installation and repair','Drain cleaning and repair'],
  },
  {
    id: 8,
    icon: truck,
    text: 'Moving Services',
    options: ['Local and long-distance moving', 'Packing and unpacking', 'Furniture assembly and disassembly','Furniture assembly and disassembly'],
  },
  {
    id: 9,
    icon: sapling,
    text: 'Landscaping Services',
    options: ['Lawn care and maintenance', 'Tree trimming and removal', 'Irrigation system installation and repair','Landscape design and installation'],
  },
  {
    id: 10,
    icon: tool,
    text: 'General Services',
    options: ['General home repairs and maintenance', 'Carpentry services', 'Drywall repair and installation','Gutter cleaning and repair'],
  },
];
