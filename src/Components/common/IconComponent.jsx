import React from 'react';
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  Assessment,
  DateRange,
  Notifications,
  Settings,
  ExitToApp,
  Menu,
  Close,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  ExpandLess,
  Refresh,
  Download,
  Upload,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Add,
  Remove,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Error,
  Visibility,
  VisibilityOff,
  Print,
  Share,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Home,
  Business,
  Person,
  Group,
  Phone,
  Email,
  LocationOn,
  Schedule,
  Today,
  Event,
  CalendarToday,
  Assignment,
  Description,
  Folder,
  FolderOpen,
  InsertDriveFile,
  Image,
  VideoLibrary,
  MusicNote,
  CloudDownload,
  CloudUpload,
  Storage,
  Computer,
  Smartphone,
  Tablet,
  Watch,
  Tv,
  Speaker,
  Headset,
  Camera,
  Videocam,
  MicNone,
  VolumeUp,
  VolumeOff,
  Brightness7,
  Brightness4,
  WifiOff,
  Wifi,
  BluetoothDisabled,
  Bluetooth,
  BatteryFull,
  BatteryAlert,
  SignalWifi4Bar,
  SignalWifiOff,
  LocalShipping,
  DirectionsCar,
  Flight,
  Train,
  DirectionsBus,
  DirectionsWalk,
  DirectionsRun,
  DirectionsBike,
  Navigation,
  MyLocation,
  Place,
  Map,
  Terrain,
  Layers,
  Traffic,
  LocalGasStation,
  LocalParking,
  LocalHospital,
  LocalPharmacy,
  Restaurant,
  LocalCafe,
  LocalBar,
  ShoppingCart,
  ShoppingBag,
  Store,
  Storefront,
  AccountBalance,
  CreditCard,
  Payment,
  MonetizationOn,
  PieChart,
  BarChart,
  ShowChart,
  Timeline,
  MultilineChart,
  DonutLarge,
  DonutSmall
} from '@mui/icons-material';

// Icon mapping object for easy access
const iconMap = {
  // Dashboard & Navigation
  dashboard: Dashboard,
  menu: Menu,
  close: Close,
  home: Home,
  
  // Trends & Analytics
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  assessment: Assessment,
  pieChart: PieChart,
  barChart: BarChart,
  showChart: ShowChart,
  timeline: Timeline,
  multilineChart: MultilineChart,
  donutLarge: DonutLarge,
  donutSmall: DonutSmall,
  
  // People & Users
  people: People,
  person: Person,
  group: Group,
  
  // Money & Business
  money: AttachMoney,
  monetization: MonetizationOn,
  payment: Payment,
  creditCard: CreditCard,
  accountBalance: AccountBalance,
  business: Business,
  
  // Actions
  add: Add,
  remove: Remove,
  edit: Edit,
  delete: Delete,
  refresh: Refresh,
  download: Download,
  upload: Upload,
  search: Search,
  filter: FilterList,
  more: MoreVert,
  print: Print,
  share: Share,
  
  // Status & Feedback
  checkCircle: CheckCircle,
  cancel: Cancel,
  warning: Warning,
  info: Info,
  error: Error,
  
  // Navigation
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  expandMore: ExpandMore,
  expandLess: ExpandLess,
  
  // Visibility
  visibility: Visibility,
  visibilityOff: VisibilityOff,
  
  // Dates & Time
  dateRange: DateRange,
  schedule: Schedule,
  today: Today,
  event: Event,
  calendarToday: CalendarToday,
  
  // Communication
  phone: Phone,
  email: Email,
  notifications: Notifications,
  
  // Location
  locationOn: LocationOn,
  place: Place,
  map: Map,
  myLocation: MyLocation,
  navigation: Navigation,
  
  // Files & Documents
  assignment: Assignment,
  description: Description,
  folder: Folder,
  folderOpen: FolderOpen,
  insertDriveFile: InsertDriveFile,
  
  // Media
  image: Image,
  videoLibrary: VideoLibrary,
  musicNote: MusicNote,
  camera: Camera,
  videocam: Videocam,
  
  // System
  settings: Settings,
  exitToApp: ExitToApp,
  computer: Computer,
  smartphone: Smartphone,
  tablet: Tablet,
  
  // Transportation
  localShipping: LocalShipping,
  directionsCar: DirectionsCar,
  flight: Flight,
  train: Train,
  directionsBus: DirectionsBus,
  
  // Shopping & Commerce
  shoppingCart: ShoppingCart,
  shoppingBag: ShoppingBag,
  store: Store,
  storefront: Storefront,
  
  // Favorites & Ratings
  star: Star,
  starBorder: StarBorder,
  favorite: Favorite,
  favoriteBorder: FavoriteBorder,
  thumbUp: ThumbUp,
  thumbDown: ThumbDown,
  
  // Services
  localGasStation: LocalGasStation,
  localParking: LocalParking,
  localHospital: LocalHospital,
  restaurant: Restaurant,
  localCafe: LocalCafe
};

const IconComponent = ({ 
  name, 
  className = '', 
  size = 'medium', 
  color = 'inherit',
  onClick,
  style = {},
  ...props 
}) => {
  const IconElement = iconMap[name];
  
  if (!IconElement) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  // Size mapping
  const sizeMap = {
    small: '20px',
    medium: '24px',
    large: '32px',
    xlarge: '40px'
  };

  // Color mapping for common colors
  const colorMap = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    inherit: 'inherit'
  };

  const iconStyle = {
    fontSize: sizeMap[size] || size,
    color: colorMap[color] || color,
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <IconElement
      className={className}
      style={iconStyle}
      onClick={onClick}
      {...props}
    />
  );
};

export default IconComponent;

// Export individual icons for direct use if needed
export { iconMap };

// Common icon combinations for dashboard
export const DashboardIcons = {
  overview: 'dashboard',
  sales: 'trendingUp',
  team: 'group',
  revenue: 'money',
  customers: 'people',
  analytics: 'assessment',
  reports: 'barChart',
  notifications: 'notifications',
  settings: 'settings',
  export: 'download',
  refresh: 'refresh',
  filter: 'filter',
  search: 'search',
  calendar: 'calendarToday',
  location: 'locationOn',
  phone: 'phone',
  email: 'email',
  car: 'directionsCar',
  success: 'checkCircle',
  warning: 'warning',
  error: 'error',
  info: 'info'
};