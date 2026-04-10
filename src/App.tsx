import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VidaApp = lazy(() => import('./vidaApp/App'));
import { 
  Car, 
  User, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Search,
  Users,
  FileText,
  ClipboardList,
  HelpCircle,
  Home,
  FileCheck,
  UserCircle,
  MapPin,
  CreditCard,
  Plus,
  X,
  AlertCircle,
  Shield,
  Scale,
  DollarSign,
  MessageSquare,
  Menu,
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  Grid,
  Heart,
  Activity,
  CreditCard as CreditCardIcon,
  AlertTriangle,
  Users2,
  PieChart,
  ExternalLink
} from 'lucide-react';

// --- Types ---
type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  tomador: { 
    idType: string; 
    id: string; 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string;
    shippingType: string;
    isIdValidated: boolean;
  };
  asegurado: { 
    isSameAsTomador: boolean; 
    idType: string;
    id: string; 
    firstName: string; 
    lastName: string;
    isIdValidated: boolean;
    ciudadResidencia: string;
    ciudadMovilizacion: string;
  };
  vehiculo: { 
    plate: string; 
    brand: string; 
    model: string; 
    year: string;
    type: string;
    use: string;
    color: string;
    engineNumber: string;
    chassisNumber: string;
    coverage: string;
    isNew: string;
    insuredAmount: string;
    subproducto: 'Opciones' | 'Oferta Verde' | 'Otros';
  };
  conductorHabitual: {
    name: string;
    gender: string;
    civilStatus: string;
    birthDate: string;
    occupation: string;
  };
  coberturas: {
    alternativa: string;
    opcionAutos: string;
    pequeñosAccesorios: boolean;
    movilidad360: boolean;
    asistencia: string;
  };
  responsabilidadCivil: {
    extracontractual: string;
    suplementaria: string;
    deducibleRC: string;
  };
  deducibles: {
    parcialDaños: string;
    coberturaHurto: string;
    totalDaños: string;
  };
  observaciones: string;
  accesorios: {
    id: string;
    name: string;
    isOriginal: boolean;
    value: number;
    brand: string;
  }[];
  beneficiarioOneroso: {
    isBeneficiario: boolean;
    isSameAsAsegurado: boolean;
    idType: string;
    id: string;
    name: string;
  };
  beneficiarios: { name: string; percentage: string }[];
  documentacion: { 
    idFront: File | null; 
    idBack: File | null; 
    tarjetaPropiedad: File | null;
    solicitudCliente: File | null;
    facturaVehiculo: File | null;
    facturaAccesorios: File | null;
    facturaBlindaje: File | null;
    resolucionBlindaje: File | null;
  };
}

// --- Constants ---
const STEPS = [
  { id: 1, label: 'DATOS DEL TOMADOR', icon: User },
  { id: 2, label: 'VEHÍCULO', icon: Car },
  { id: 3, label: 'ASEGURADO', icon: Users },
  { id: 4, label: 'BENEFICIARIOS', icon: ClipboardList },
  { id: 5, label: 'DOCUMENTACIÓN', icon: FileText },
  { id: 6, label: 'RESUMEN', icon: CheckCircle },
];

const NAV_ITEMS = [
  { label: 'Inicio', icon: Home },
  { label: 'Mis Pólizas', icon: FileCheck },
  { label: 'Cotizar', icon: ShieldCheck },
  { label: 'Emitir', icon: FileText },
  { label: 'Perfil', icon: UserCircle },
  { label: 'Ayuda', icon: HelpCircle },
];

function LandingPage({ onConsult }: { onConsult: (data: { plate: string, brand: string, model: string }) => void; key?: string }) {
  const [activeTab, setActiveTab] = useState<'placa' | 'marca'>('placa');
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asesorCode, setAsesorCode] = useState('ASE001');

  const handleConsult = () => {
    let result = { plate: placa, brand: marca, model: descripcion };
    if (placa.toUpperCase() === 'EMQ706') {
      result = { plate: 'EMQ706', brand: 'Chevrolet', model: 'Equinox' };
    } else if (descripcion.toLowerCase().includes('equinox')) {
      result = { plate: 'EMQ706', brand: 'Chevrolet', model: 'Equinox' };
    } else if (marca.toLowerCase().includes('chevrolet')) {
      result = { plate: 'EMQ706', brand: 'Chevrolet', model: 'Equinox' };
    }
    onConsult(result);
  };

  const isValid = placa.trim() !== '' || marca.trim() !== '' || descripcion.trim() !== '';

  return (
    <div className="flex-1 flex flex-col items-center py-6 space-y-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-7xl rounded-[40px] overflow-hidden shadow-2xl bg-white border border-gray-100"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Left Side: Brand Experience */}
          <div className="lg:col-span-7 relative p-12 md:p-20 flex flex-col justify-center overflow-hidden">
            {/* Background Image with Soft Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" 
                alt="Family in car" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-bolivar-green/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-bolivar-green/50 via-bolivar-green/30 to-transparent"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10 space-y-10"
            >
              <div className="inline-flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest">
                <Shield size={22} className="text-white" />
                SEGURO DE AUTOS
              </div>
              
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter">
                  Protege lo que <br />
                  <span className="text-bolivar-yellow">más quieres</span>
                </h1>
                <p className="text-xl text-white/90 font-medium max-w-lg leading-relaxed">
                  Tranquilidad para ti y tu familia en cada kilómetro. Emite tu póliza de forma digital en minutos.
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => onConsult({ plate: '', brand: '', model: '' })}
                  className="flex items-center gap-3 bg-white text-bolivar-green px-10 py-4 rounded-full font-black text-lg shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Inicia tu proceso en el formulario
                  <ArrowRight size={22} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Consultation Card */}
          <div className="lg:col-span-5 bg-transparent p-8 md:p-12 flex flex-col justify-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[32px] p-10 shadow-2xl border border-white/20 space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-4xl font-black text-bolivar-dark tracking-tighter">Cotizador de Autos</h2>
                <p className="text-gray-500 font-medium text-sm">Ingresa los datos del vehículo para comenzar.</p>
              </div>

              {/* Tabs */}
              <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1">
                <button 
                  onClick={() => setActiveTab('placa')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'placa' ? 'bg-bolivar-yellow text-bolivar-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Por Placa
                </button>
                <button 
                  onClick={() => setActiveTab('marca')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'marca' ? 'bg-bolivar-yellow text-bolivar-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Marca / Fasecolda
                </button>
              </div>

              <div className="space-y-5 text-left">
                {activeTab === 'placa' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Placa del vehículo*</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                        placeholder="AAA123"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black text-bolivar-dark placeholder:text-gray-300 outline-none focus:border-bolivar-green/30 transition-all"
                      />
                      <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-bolivar-green transition-colors" size={24} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Marca*</label>
                      <input 
                        type="text" 
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                        placeholder="Ej: Chevrolet"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-bolivar-dark outline-none focus:border-bolivar-green/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Descripción*</label>
                      <input 
                        type="text" 
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ej: Equinox"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-bolivar-dark outline-none focus:border-bolivar-green/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Código del Asesor (Opcional) <span className="text-gray-300 font-medium lowercase">(opcional)</span></label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={asesorCode}
                      onChange={(e) => setAsesorCode(e.target.value)}
                      placeholder="ASE001"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-xl font-black text-bolivar-dark placeholder:text-gray-300 outline-none focus:border-bolivar-green/30 transition-all"
                    />
                    <UserCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-bolivar-green transition-colors" size={24} />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium ml-1 italic">La clave asesor debe ser numérica</p>
                </div>
              </div>

              <button 
                onClick={handleConsult}
                disabled={!isValid}
                className={`w-full py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl ${
                  isValid 
                    ? 'bg-bolivar-yellow text-bolivar-dark hover:bg-bolivar-yellow/90 shadow-bolivar-yellow/20' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                Inicia tu proceso aquí <ArrowRight size={24} />
              </button>

              <div className="flex items-center justify-center gap-2 text-bolivar-green/60 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={16} />
                Tus datos están protegidos y seguros
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats or Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
        {[
          { icon: Shield, title: "Cobertura Total", desc: "Respaldo integral ante cualquier imprevisto en la vía." },
          { icon: HelpCircle, title: "Asistencia 24/7", desc: "Estamos contigo en todo momento, a un clic de distancia." },
          { icon: CheckCircle, title: "Proceso Digital", desc: "Emisión 100% en línea, sin trámites físicos innecesarios." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center text-bolivar-green transform transition-transform hover:scale-110">
              <item.icon size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-bolivar-dark text-lg tracking-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Vista de Consulta de cotizaciones y pólizas */
function ConsultaView({ onStartAutos, onStartVida }: { onStartAutos: (preload?: { idType: string; id: string }) => void; onStartVida: (preload?: { idType: string; id: string }) => void }) {
  const [tipoId, setTipoId] = useState('');
  const [numId, setNumId] = useState('');
  const [numCotizacion, setNumCotizacion] = useState('');
  const [numPoliza, setNumPoliza] = useState('');
  const [numConsecutivo, setNumConsecutivo] = useState('');
  const [ramo, setRamo] = useState('');
  const [fechaCotizacion, setFechaCotizacion] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<null | { found: boolean; ramo: string; nombre: string }>(null);

  const cotizacionHasValue = numCotizacion.trim().length > 0;
  const polizaHasValue = numPoliza.trim().length > 0;

  const canSearch = ramo && (numCotizacion || numPoliza);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchResult(null);
    // Simular búsqueda
    setTimeout(() => {
      setIsSearching(false);
      if (numId === '1129564302' || numCotizacion || numPoliza) {
        setSearchResult({ found: true, ramo, nombre: 'Carlos Alberto Figueroa Martínez' });
      } else {
        setSearchResult({ found: false, ramo: '', nombre: '' });
      }
    }, 1200);
  };

  const handleOpenResult = () => {
    if (!searchResult?.found) return;
    const preload = { idType: tipoId || 'CC', id: numId || '1129564302' };
    if (searchResult.ramo === 'Autos') onStartAutos(preload);
    if (searchResult.ramo === 'Vida') onStartVida(preload);
  };

  const handleReset = () => {
    setTipoId(''); setNumId(''); setNumCotizacion(''); setNumPoliza('');
    setNumConsecutivo(''); setRamo(''); setFechaCotizacion('');
    setSearchResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#008F7A]/10">
          <Search className="h-7 w-7 text-[#008F7A]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800">Consulta</h2>
          <p className="text-gray-500 font-medium">Busca cotizaciones y pólizas por diferentes criterios.</p>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <div className="border-l-4 border-[#008F7A] pl-4 mb-8">
          <h3 className="text-xl font-bold text-gray-800">Criterios de Búsqueda</h3>
          <p className="text-sm text-gray-500">Completa los campos para realizar la consulta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tipo de identificación */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de identificación</label>
            <select value={tipoId} onChange={(e) => setTipoId(e.target.value)}
              className="sb-ui-select w-full">
              <option value="">Seleccionar...</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PA">Pasaporte</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>

          {/* Número de identificación */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de identificación</label>
            <input type="text" value={numId} onChange={(e) => setNumId(e.target.value)}
              placeholder="Ej: 1129564302" className="sb-ui-input w-full" />
          </div>

          {/* N° de cotización */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              N° de cotización <span className="text-red-500">*</span>
            </label>
            <input type="text" value={numCotizacion}
              onChange={(e) => { setNumCotizacion(e.target.value); if (e.target.value) setNumPoliza(''); }}
              disabled={polizaHasValue}
              placeholder={polizaHasValue ? 'Inhabilitado (N° póliza activo)' : 'Ej: COT-A1B2C3D4'}
              className={`sb-ui-input w-full ${polizaHasValue ? 'sb-ui-input--disabled' : ''}`} />
          </div>

          {/* N° de póliza */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              N° de póliza <span className="text-red-500">*</span>
            </label>
            <input type="text" value={numPoliza}
              onChange={(e) => { setNumPoliza(e.target.value); if (e.target.value) setNumCotizacion(''); }}
              disabled={cotizacionHasValue}
              placeholder={cotizacionHasValue ? 'Inhabilitado (N° cotización activo)' : 'Ej: 1234567890123'}
              className={`sb-ui-input w-full ${cotizacionHasValue ? 'sb-ui-input--disabled' : ''}`} />
          </div>

          {/* N° de consecutivo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">N° de consecutivo</label>
            <input type="text" value={numConsecutivo} onChange={(e) => setNumConsecutivo(e.target.value)}
              placeholder="Opcional" className="sb-ui-input w-full" />
          </div>

          {/* Ramo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Ramo <span className="text-red-500">*</span>
            </label>
            <select value={ramo} onChange={(e) => setRamo(e.target.value)}
              className="sb-ui-select w-full">
              <option value="">Seleccionar ramo...</option>
              <option value="Autos">Autos</option>
              <option value="Vida">Vida</option>
              <option value="Salud">Salud</option>
              <option value="Hogar">Hogar</option>
              <option value="Pyme">Pyme</option>
            </select>
          </div>

          {/* Fecha de cotización */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha de cotización</label>
            <input type="date" value={fechaCotizacion} onChange={(e) => setFechaCotizacion(e.target.value)}
              className="sb-ui-input w-full" />
          </div>
        </div>

        {/* Nota de dependencia */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>Los campos N° de cotización y N° de póliza son excluyentes: al diligenciar uno, el otro se inhabilita automáticamente.</span>
        </div>

        {/* Botones */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={handleReset}
            className="sb-ui-button sb-ui-button--secondary">
            Limpiar
          </button>
          <button type="button" onClick={handleSearch} disabled={!canSearch || isSearching}
            className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill ${(!canSearch || isSearching) ? 'sb-ui-button--disabled' : ''}`}>
            {isSearching ? (
              <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" /> Buscando...</>
            ) : (
              <><Search size={16} className="mr-2 inline" /> Consultar</>
            )}
          </button>
        </div>
      </div>

      {/* Resultado */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {searchResult.found ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00C875]/10">
                    <CheckCircle size={20} className="text-[#00C875]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Resultado Encontrado</h3>
                    <p className="text-sm text-gray-500">Se encontró información para los criterios ingresados.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{searchResult.nombre}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ramo</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{searchResult.ramo}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{numCotizacion ? 'N° Cotización' : 'N° Póliza'}</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{numCotizacion || numPoliza}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identificación</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{tipoId} {numId}</p>
                  </div>
                </div>

                {(searchResult.ramo === 'Autos' || searchResult.ramo === 'Vida') ? (
                  <button type="button" onClick={handleOpenResult}
                    className="sb-ui-button sb-ui-button--primary sb-ui-button--fill">
                    <ExternalLink size={16} className="mr-2 inline" />
                    Abrir formulario de {searchResult.ramo}
                  </button>
                ) : (
                  <p className="text-sm text-gray-400 italic">El formulario de {searchResult.ramo} estará disponible próximamente.</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-700">Sin resultados</h3>
                <p className="text-sm text-gray-400 mt-1">No se encontraron registros con los criterios ingresados.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IntermediaryPortal({ onStartAutos, onStartVida }: { onStartAutos: (preload?: { idType: string; id: string }) => void; onStartVida: (preload?: { idType: string; id: string }) => void }) {
  const [activeMenu, setActiveMenu] = useState('Inicio');
  const [isGestionOpen, setIsGestionOpen] = useState(true);
  const [portalView, setPortalView] = useState<'dashboard' | 'cotizar' | 'consulta'>('dashboard');

  const menuItems = [
    { id: 'Inicio', label: 'Inicio', icon: Home },
    { 
      id: 'Gestion', 
      label: 'Gestión de pólizas', 
      icon: FileText, 
      subItems: [
        { id: 'cotizar', label: 'Cotizar y emitir', icon: ShieldCheck },
        { id: 'consulta', label: 'Consulta', icon: Search },
        { id: 'modificar', label: 'Modificar', icon: FileCheck },
        { id: 'incluir', label: 'Incluir riesgos', icon: Plus },
        { id: 'prevision', label: 'Previsión', icon: AlertCircle },
        { id: 'consecutivo', label: 'Crear consecutivo', icon: ClipboardList },
      ] 
    },
    { id: 'Servicios', label: 'Servicios y reportes', icon: Grid },
    { id: 'Pagos', label: 'Pagos', icon: DollarSign },
    { id: 'Siniestros', label: 'Siniestros', icon: AlertTriangle },
    { id: 'Clientes', label: 'Mis clientes', icon: Users2 },
    { id: 'Comisiones', label: 'Comisiones', icon: PieChart },
  ];

  const dashboardCards = [
    { title: 'Historial de solicitudes', count: 38, color: 'bg-[#E6F4F1]', iconColor: 'text-[#008F7A]', icon: FileText, action: 'Ver solicitudes' },
    { title: 'Solicitudes que requieren información', count: 0, color: 'bg-[#FFF0F0]', iconColor: 'text-[#E63946]', icon: AlertCircle, action: 'Completar' },
    { title: 'Solicitudes en curso', count: 34, color: 'bg-[#FFF9E6]', iconColor: 'text-[#F4A261]', icon: Activity, action: 'Ver progreso' },
  ];

  const cotizarCards = [
    { 
      title: 'Autos', 
      desc: 'Protección total para vehículos particulares y públicos. Emisión digital inmediata.', 
      icon: Car, 
      buttonText: 'Cotizar Autos',
      onClick: onStartAutos
    },
    { 
      title: 'Vida', 
      desc: 'Seguros de vida individual y grupo. Respaldo para lo que más importa.', 
      icon: Heart, 
      buttonText: 'Cotizar Vida',
      onClick: onStartVida
    },
    { 
      title: 'Salud', 
      desc: 'Planes de salud nacional e internacional con la mejor red médica.', 
      icon: Activity, 
      buttonText: 'Cotizar Salud' 
    },
    { 
      title: 'Pymes + Digital', 
      desc: 'Protección empresarial con emisión 100% digital. Respaldo en daños, responsabilidad y servicios de asistencia.', 
      icon: Briefcase, 
      buttonText: 'Ir a Pymes + Digital' 
    },
    { 
      title: 'Protección de créditos', 
      desc: 'Vida + Hogar', 
      icon: ShieldCheck, 
      buttonText: 'Ir a Procréditos' 
    },
    { 
      title: 'Cumplimiento', 
      desc: 'Respaldo contractual para contratistas, particulares y sector público.', 
      icon: Scale, 
      buttonText: 'Ir a Cumplimiento' 
    },
    { 
      title: 'Otros productos', 
      desc: 'Desde aquí puedes cotizar o emitir otros productos.', 
      icon: Grid, 
      buttonText: 'Crear Consecutivo',
      isGreen: true
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 flex items-start gap-3">
          <Menu className="text-gray-400 mt-1" size={20} />
          <div>
            <p className="text-[#008F7A] font-bold text-lg leading-tight">Portal</p>
            <p className="text-[#008F7A] font-bold text-lg leading-tight">Intermediarios</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    setIsGestionOpen(!isGestionOpen);
                  } else {
                    setActiveMenu(item.id);
                    setPortalView('dashboard');
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeMenu === item.id ? 'bg-[#E6F4F1] text-[#008F7A]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.subItems && (
                  isGestionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                )}
              </button>
              
              {item.subItems && isGestionOpen && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveMenu(sub.id);
                        if (sub.id === 'cotizar') setPortalView('cotizar');
                        if (sub.id === 'consulta') setPortalView('consulta');
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                        activeMenu === sub.id ? 'bg-[#E6F4F1] text-[#008F7A]' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          {['Términos y condiciones de uso', 'Políticas de Seguridad', 'Políticas de Privacidad', 'Ley FATCA'].map((text) => (
            <button key={text} className="w-full text-left p-2 text-[10px] text-gray-400 hover:text-gray-600 uppercase tracking-wider font-bold">
              {text}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYg5kVltAZ8AuqtHW4YR0l-0u0aEC1hFx-Hw&s" 
              alt="Seguros Bolívar" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm font-bold text-[#008F7A] hover:bg-[#E6F4F1] px-4 py-2 rounded-lg transition-colors">
              Herramientas
              <ChevronDown size={16} />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#008F7A] flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {portalView === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Welcome Header */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800">Hola Carlos Figueroa,</h2>
                    <p className="text-xl text-gray-500">¿qué necesitas hoy?</p>
                  </div>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Clave:</p>
                      <p className="text-lg font-bold text-gray-700">57271</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Especialidad:</p>
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">Sin especialidades</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha vencimiento idoneidad:</p>
                      <p className="text-lg font-bold text-gray-700">-</p>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardCards.map((card, i) => (
                    <div key={i} className={`${card.color} p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden group`}>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                          <p className="text-4xl font-black text-gray-800">{card.count}</p>
                          <p className="text-sm font-bold text-gray-600 max-w-[150px]">{card.title}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${card.iconColor} shadow-sm`}>
                          <card.icon size={24} />
                        </div>
                      </div>
                      <button className="w-full py-3 bg-white/60 hover:bg-white transition-colors rounded-full text-sm font-bold text-gray-700 relative z-10">
                        {card.action}
                      </button>
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <card.icon size={120} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lo que más usas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Lo que más usas:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Crear consecutivo', icon: Plus },
                      { label: 'Consultar consecutivo', icon: Search },
                      { label: 'Otros productos', icon: Grid },
                      { label: 'Protección familiar', icon: ShieldCheck },
                      { label: 'Mis clientes', icon: Users2 },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-[#008F7A] group-hover:scale-110 transition-transform">
                          <item.icon size={20} />
                        </div>
                        <span className="font-bold text-gray-600 text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : portalView === 'cotizar' ? (
              <motion.div
                key="cotizar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Home size={12} />
                  <ChevronRight size={12} />
                  <span>Gestión de pólizas</span>
                  <ChevronRight size={12} />
                  <span className="text-gray-600">Cotizar y emitir</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-800">Cotizar y emitir</h2>
                  <p className="text-gray-500 font-medium">Navega por nuestros productos y cotiza o emite rápido en un solo lugar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cotizarCards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-gray-800">{card.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">{card.desc}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#008F7A]">
                          <card.icon size={24} />
                        </div>
                      </div>
                      <button 
                        onClick={card.onClick}
                        className={`w-full py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
                          card.isGreen 
                            ? 'bg-[#008F7A] text-white hover:bg-[#007A68]' 
                            : 'bg-bolivar-yellow text-bolivar-dark hover:bg-bolivar-yellow/90'
                        }`}
                      >
                        {card.buttonText}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : portalView === 'consulta' ? (
              <motion.div
                key="consulta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Home size={12} />
                  <ChevronRight size={12} />
                  <span>Gestión de pólizas</span>
                  <ChevronRight size={12} />
                  <span className="text-gray-600">Consulta</span>
                </div>

                <ConsultaView onStartAutos={onStartAutos} onStartVida={onStartVida} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-bolivar-yellow rounded-full shadow-xl flex items-center justify-center text-bolivar-dark hover:scale-110 transition-transform z-50">
        <UserCircle size={32} />
      </button>
    </div>
  );
}

export default function App() {
  const [appView, setAppView] = useState<'portal' | 'form' | 'vida'>('portal');
  const [activeNav, setActiveNav] = useState('Inicio');
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPersonModal, setShowPersonModal] = useState<'natural' | 'juridica' | null>(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [includeAccesorios, setIncludeAccesorios] = useState(false);
  const [radicado, setRadicado] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tomador: { 
      idType: '', 
      id: '', 
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '',
      shippingType: 'Póliza electrónica',
      isIdValidated: false
    },
    asegurado: { 
      isSameAsTomador: true, 
      idType: '',
      id: '', 
      firstName: '', 
      lastName: '',
      isIdValidated: true, // Tomador is validated by default if same as tomador
      ciudadResidencia: '',
      ciudadMovilizacion: ''
    },
    vehiculo: { 
      plate: '', 
      brand: '', 
      model: '', 
      year: '',
      type: '',
      use: '',
      color: '',
      engineNumber: '',
      chassisNumber: '',
      coverage: '',
      isNew: '',
      insuredAmount: '',
      subproducto: 'Opciones'
    },
    conductorHabitual: {
      name: '',
      gender: '',
      civilStatus: '',
      birthDate: '',
      occupation: ''
    },
    coberturas: {
      alternativa: '',
      opcionAutos: '',
      pequeñosAccesorios: false,
      movilidad360: false,
      asistencia: ''
    },
    responsabilidadCivil: {
      extracontractual: '',
      suplementaria: '',
      deducibleRC: ''
    },
    deducibles: {
      parcialDaños: '',
      coberturaHurto: '',
      totalDaños: ''
    },
    observaciones: '',
    accesorios: [],
    beneficiarioOneroso: {
      isBeneficiario: false,
      isSameAsAsegurado: false,
      idType: '',
      id: '',
      name: ''
    },
    beneficiarios: [{ name: '', percentage: '' }],
    documentacion: { 
      idFront: null, 
      idBack: null, 
      tarjetaPropiedad: null,
      solicitudCliente: null,
      facturaVehiculo: null,
      facturaAccesorios: null,
      facturaBlindaje: null,
      resolucionBlindaje: null
    }
  });

  const isStepValid = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(formData.tomador.idType && formData.tomador.id && formData.tomador.firstName && formData.tomador.lastName && formData.tomador.email && formData.tomador.phone);
      case 2:
        const v = formData.vehiculo;
        return !!(v.plate && v.brand && v.type && v.use && v.model && v.color && v.engineNumber && v.chassisNumber && v.coverage && v.insuredAmount);
      case 3:
        const hasAsegurado = !!(formData.asegurado.idType && formData.asegurado.id && formData.asegurado.firstName && formData.asegurado.lastName);
        const hasCiudad = !!formData.asegurado.ciudadResidencia;
        const isBenValid = !formData.beneficiarioOneroso.isBeneficiario || 
          !!(formData.beneficiarioOneroso.idType && formData.beneficiarioOneroso.id && formData.beneficiarioOneroso.name);
        const totalAccValue = formData.accesorios.reduce((sum, acc) => sum + acc.value, 0);
        const commercialValue = parseFloat(formData.vehiculo.insuredAmount.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const isAccValid = commercialValue > 0 ? (totalAccValue <= commercialValue * 0.2) : true;
        
        const hasHabitual = !formData.vehiculo.use.toLowerCase().includes('particular') || 
          !!(formData.conductorHabitual.gender && formData.conductorHabitual.civilStatus && formData.conductorHabitual.birthDate && formData.conductorHabitual.occupation);
        
        const hasCoberturas = !!formData.coberturas.alternativa && 
          (formData.coberturas.alternativa !== '43' || !!formData.coberturas.opcionAutos);
        
        const hasRC = (formData.vehiculo.subproducto === 'Opciones' || formData.vehiculo.subproducto === 'Oferta Verde')
          ? !!(formData.responsabilidadCivil.extracontractual && formData.responsabilidadCivil.deducibleRC)
          : !!formData.responsabilidadCivil.suplementaria;
          
        const hasDeducibles = !!(formData.deducibles.parcialDaños && formData.deducibles.coberturaHurto && formData.deducibles.totalDaños);

        return hasAsegurado && hasCiudad && isBenValid && isAccValid && hasHabitual && hasCoberturas && hasRC && hasDeducibles;
      case 4:
        const totalPercentage = formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
        return formData.beneficiarios.length > 0 && 
               formData.beneficiarios.every(b => b.name && b.percentage) && 
               totalPercentage === 100;
      case 5:
        const d = formData.documentacion;
        const hasBasicDocs = !!(d.idFront && d.idBack && d.tarjetaPropiedad && d.solicitudCliente);
        const hasFacturaVehiculo = formData.vehiculo.isNew !== 'Si' || !!d.facturaVehiculo;
        const hasFacturaAccesorios = formData.accesorios.length === 0 || !!d.facturaAccesorios;
        const hasFacturaBlindaje = !formData.accesorios.some(a => a.name === 'Blindaje') || !!d.facturaBlindaje;
        return hasBasicDocs && hasFacturaVehiculo && hasFacturaAccesorios && hasFacturaBlindaje;
      case 6:
        return acceptedTerms;
      default:
        return false;
    }
  };

  const handleIdInput = (id: string, target: 'tomador' | 'asegurado' = 'tomador') => {
    setFormData(prev => ({ 
      ...prev, 
      [target]: { ...prev[target], id, isIdValidated: false } 
    }));
  };

  const handleIdBlur = (id: string, target: 'tomador' | 'asegurado' = 'tomador') => {
    if (!id) return;
    
    const idType = formData[target].idType;
    
    // Set validated to true when leaving the field
    setFormData(prev => ({
      ...prev,
      [target]: { ...prev[target], isIdValidated: true }
    }));
    
    // Auto-population logic
    if (id === '1129564302' && idType === 'Cédula de ciudadania') {
      setFormData(prev => ({
        ...prev,
        [target]: {
          ...prev[target],
          firstName: 'Carlos Alberto',
          lastName: 'Figueroa Martinez',
          ...(target === 'tomador' ? {
            email: 'carlos123@gmail.com',
            phone: '6015632548'
          } : {})
        }
      }));
    } else if (id === '1015432078' && idType === 'Cédula de ciudadania') {
      setFormData(prev => ({
        ...prev,
        [target]: {
          ...prev[target],
          firstName: 'GLORIA ESMERALDA',
          lastName: 'GONZALEZ DIAZ'
        }
      }));
    } else if (id.length >= 6) {
      if (idType === 'NIT') {
        const nitRegex = /^\d{9}-\d$/;
        if (nitRegex.test(id)) {
          setShowPersonModal('juridica');
        }
      } else {
        if (id !== '1129564302' && id !== '1015432078') setShowPersonModal('natural');
      }
    }
  };

  const handlePlateChange = (plate: string) => {
    const cleanPlate = plate.toUpperCase().replace(/\s/g, '');
    
    if (cleanPlate === 'EMQ706') {
      setVehicleFound(true);
      setFormData(prev => ({
        ...prev,
        vehiculo: {
          ...prev.vehiculo,
          plate: cleanPlate,
          brand: 'Chevrolet',
          model: 'Equinox',
          year: '',
          type: 'Camioneta',
          use: 'Particular familiar',
          color: 'Blanco',
          engineNumber: 'ADR984672995478DC',
          chassisNumber: 'MFR3425897194SMD',
          coverage: 'Alta',
          isNew: 'No',
          insuredAmount: '290000000',
          subproducto: 'Opciones'
        }
      }));
    } else if (cleanPlate.length >= 6) {
      setVehicleFound(true);
      setFormData(prev => {
        const isClearing = prev.vehiculo.brand === 'Chevrolet' && prev.vehiculo.engineNumber === 'ADR984672995478DC';
        return {
          ...prev,
          vehiculo: {
            ...prev.vehiculo,
            plate: cleanPlate,
            ...(isClearing ? {
              brand: '',
              model: '',
              year: '',
              type: '',
              use: '',
              color: '',
              engineNumber: '',
              chassisNumber: '',
              coverage: '',
              isNew: '',
              insuredAmount: '',
              subproducto: 'Opciones'
            } : {})
          }
        };
      });
    } else {
      setVehicleFound(false);
      setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, plate: cleanPlate } }));
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as Step);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const newRadicado = Math.floor(1000000 + Math.random() * 9000000).toString();
    setRadicado(newRadicado);
    setIsSubmitted(true);
    generatePDF(newRadicado);
  };

  const generatePDF = (radicadoNum: string) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 153, 0); // Bolivar Green
    doc.text('Seguros Bolívar', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Solicitud de Seguro de Autos', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Radicado: ${radicadoNum}`, 105, 38, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 44, { align: 'center' });

    // Tomador Section
    (doc as any).autoTable({
      startY: 55,
      head: [['DATOS DEL TOMADOR', '']],
      body: [
        ['Nombre Completo', `${formData.tomador.firstName} ${formData.tomador.lastName}`],
        ['Identificación', `${formData.tomador.idType} ${formData.tomador.id}`],
        ['Correo Electrónico', formData.tomador.email],
        ['Teléfono', formData.tomador.phone],
        ['Tipo de Envío', formData.tomador.shippingType],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 153, 0] },
    });

    // Vehículo Section
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['DATOS DEL VEHÍCULO', '']],
      body: [
        ['Placa', formData.vehiculo.plate],
        ['Marca / Modelo', `${formData.vehiculo.brand} ${formData.vehiculo.model}`],
        ['Año', formData.vehiculo.year],
        ['Uso', formData.vehiculo.use],
        ['Color', formData.vehiculo.color],
        ['Valor Asegurado', `$${formData.vehiculo.insuredAmount}`],
        ['Subproducto', formData.vehiculo.subproducto],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 153, 0] },
    });

    // Coberturas Section
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['COBERTURAS Y DEDUCIBLES', '']],
      body: [
        ['Alternativa', formData.coberturas.alternativa],
        ['Opción Autos', formData.coberturas.opcionAutos || 'N/A'],
        ['R.C. Extracontractual', formData.responsabilidadCivil.extracontractual || 'N/A'],
        ['R.C. Suplementaria', formData.responsabilidadCivil.suplementaria || 'N/A'],
        ['Deducible Parcial Daños', formData.deducibles.parcialDaños],
        ['Deducible Hurto', formData.deducibles.coberturaHurto],
        ['Deducible Total Daños', formData.deducibles.totalDaños],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 153, 0] },
    });

    // Beneficiarios Section
    if (formData.beneficiarios.length > 0) {
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['BENEFICIARIOS', 'Porcentaje']],
        body: formData.beneficiarios.map(b => [b.name, `${b.percentage}%`]),
        theme: 'striped',
        headStyles: { fillColor: [0, 153, 0] },
      });
    }

    // Asegurado Section (if different)
    if (!formData.asegurado.isSameAsTomador) {
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['DATOS DEL ASEGURADO', '']],
        body: [
          ['Nombre Completo', `${formData.asegurado.firstName} ${formData.asegurado.lastName}`],
          ['Identificación', `${formData.asegurado.idType} ${formData.asegurado.id}`],
          ['Ciudad de Residencia', formData.asegurado.ciudadResidencia],
          ['Ciudad de Movilización', formData.asegurado.ciudadMovilizacion],
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 153, 0] },
      });
    }

    // Documentation Section
    const docs = [];
    if (formData.documentacion.solicitudCliente) docs.push(['Solicitud cliente', 'Cargado']);
    if (formData.documentacion.idFront) docs.push(['Documento Identidad (Frontal)', 'Cargado']);
    if (formData.documentacion.idBack) docs.push(['Documento Identidad (Respaldo)', 'Cargado']);
    if (formData.documentacion.tarjetaPropiedad) docs.push(['Tarjeta de Propiedad', 'Cargado']);
    if (formData.documentacion.facturaVehiculo) docs.push(['Factura Vehículo', 'Cargado']);
    
    if (docs.length > 0) {
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['DOCUMENTACIÓN ADJUNTA', 'Estado']],
        body: docs,
        theme: 'striped',
        headStyles: { fillColor: [0, 153, 0] },
      });
    }

    // Final Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Esta es una solicitud de prueba generada por el Portal de Intermediarios.', 105, finalY, { align: 'center' });
    doc.text('Seguros Bolívar - Tranquilidad en cada kilómetro.', 105, finalY + 6, { align: 'center' });

    doc.save(`Solicitud_Seguro_${formData.vehiculo.plate || 'SinPlaca'}.pdf`);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  if (appView === 'portal') {
    return (
      <IntermediaryPortal 
        onStartAutos={(preload) => {
          if (preload) {
            // Pre-populate form with data from consulta
            setFormData(prev => ({
              ...prev,
              tomador: {
                ...prev.tomador,
                idType: preload.idType === 'CC' ? 'Cédula de ciudadania' : preload.idType,
                id: preload.id,
                isIdValidated: true,
                ...(preload.id === '1129564302' ? {
                  firstName: 'Carlos Alberto',
                  lastName: 'Figueroa Martinez',
                  email: 'carlos123@gmail.com',
                  phone: '6015632548',
                } : {}),
              },
              asegurado: {
                ...prev.asegurado,
                isSameAsTomador: true,
                idType: preload.idType === 'CC' ? 'Cédula de ciudadania' : preload.idType,
                id: preload.id,
                firstName: preload.id === '1129564302' ? 'Carlos Alberto' : '',
                lastName: preload.id === '1129564302' ? 'Figueroa Martinez' : '',
                isIdValidated: true,
              },
            }));
          }
          setAppView('form');
          setActiveNav('Emitir');
          setCurrentStep(1);
        }}
        onStartVida={(preload) => {
          setAppView('vida');
          setActiveNav('Emitir');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans">
      {/* Modals */}
      <AnimatePresence>
        {showPersonModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-bolivar-dark">
                  {showPersonModal === 'natural' ? 'Creación de Persona Natural' : 'Creación de Persona Jurídica'}
                </h3>
                <button onClick={() => setShowPersonModal(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-8 italic">Completar todos los campos marcados con (*) ya que son obligatorios.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showPersonModal === 'natural' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de documento*</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none">
                        <option>CEDULA DE CIUDADANIA</option>
                        <option>CEDULA DE EXTRANJERIA</option>
                        <option>PASAPORTE</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de documento*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" defaultValue={formData.tomador.id} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombres completos*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Carlos Andrés" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apellidos completos*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Rodríguez Reina" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha de Nacimiento*</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha de expedición*</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Género*</label>
                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" /> Femenino</label>
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" /> Masculino</label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ciudad de residencia*</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none">
                        <option>Seleccionar una ciudad</option>
                        <option>Bogotá</option>
                        <option>Medellín</option>
                        <option>Cali</option>
                        <option>Barranquilla</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de documento*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 outline-none" value="NIT" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de documento*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" defaultValue={formData.tomador.id} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Razón social*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Ingeniería S.A.S" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ciudad*</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none">
                        <option>Seleccionar una ciudad</option>
                        <option>Bogotá</option>
                        <option>Medellín</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dirección de oficina principal*</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Calle 22 a #8-45" />
                    </div>
                    
                    {/* Representante Legal Section */}
                    <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-bolivar-green uppercase tracking-widest mb-4">Datos del representante legal</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de documento*</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none">
                            <option>CEDULA DE CIUDADANIA</option>
                            <option>CEDULA DE EXTRANJERIA</option>
                            <option>PASAPORTE</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de documento*</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: 1020304050" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombres completos*</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Juan Camilo" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apellidos completos*</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: Pérez Gómez" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Celular*</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: 3112234545" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Correo electrónico*</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Ej: correo@gmail.com" />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button onClick={() => setShowPersonModal(null)} className="px-8 py-3 rounded-full font-bold text-bolivar-green">Cancelar</button>
                <button onClick={() => setShowPersonModal(null)} className="bg-bolivar-yellow text-bolivar-dark px-10 py-3 rounded-full font-bold shadow-lg">Continuar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <header className="bg-white border-b border-gray-100 py-3 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setAppView('portal')}
              className="p-2 text-gray-400 hover:text-bolivar-green hover:bg-gray-50 rounded-full transition-all"
              title="Volver al Portal"
            >
              <ArrowLeft size={24} />
            </button>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYg5kVltAZ8AuqtHW4YR0l-0u0aEC1hFx-Hw&s" 
              alt="Seguros Bolívar" 
              className="h-14 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Nav Menu */}
          <nav className="hidden lg:flex items-center gap-6 mx-4">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.label);
                }}
                className={`flex items-center gap-2 text-sm font-bold transition-all relative py-2 ${
                  activeNav === item.label 
                    ? 'text-bolivar-green after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-bolivar-green' 
                    : 'text-gray-500 hover:text-bolivar-green'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search & Profile */}
          <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
            <div className="relative w-full max-w-[280px] hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar póliza, cliente..." 
                className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-bolivar-green/20 outline-none"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <UserCircle size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-6">
        <AnimatePresence mode="wait">
          {appView === 'vida' ? (
            <motion.div
              key="vida"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#005931]" /></div>}>
                <VidaApp initialRoute="vida_individual" />
              </Suspense>
            </motion.div>
          ) : activeNav === 'Inicio' ? (
            <LandingPage 
              key="landing" 
              onConsult={(data) => {
                if (data.plate.toUpperCase() === 'EMQ706') {
                  handlePlateChange('EMQ706');
                } else {
                  setFormData(prev => ({
                    ...prev,
                    vehiculo: {
                      ...prev.vehiculo,
                      plate: data.plate,
                      brand: data.brand,
                      model: data.model
                    }
                  }));
                  if (data.plate.length >= 6) setVehicleFound(true);
                }
                setActiveNav('Emitir');
                setCurrentStep(1);
              }} 
            />
          ) : activeNav === 'Emitir' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-[#002B49] mb-2">Emisión de Póliza: Auto fuera del riesgo</h2>
                <p className="text-gray-500">Completa los siguientes pasos para finalizar la emisión.</p>
              </div>

        {/* High Quality Connected Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 overflow-x-auto">
          <div className="flex justify-between items-start min-w-[800px] relative">
            {/* Connecting Line Background */}
            <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-100 z-0"></div>
            
            {/* Active Progress Line */}
            <motion.div 
              className="absolute top-6 left-0 h-[2px] bg-bolivar-green z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isActive 
                        ? 'bg-bolivar-green border-bolivar-green text-white shadow-lg shadow-bolivar-green/20 scale-110' 
                        : isCompleted 
                          ? 'bg-bolivar-green border-bolivar-green text-white' 
                          : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="mt-4 text-center">
                    <p className={`text-[10px] font-bold mb-1 ${isActive ? 'text-bolivar-green' : 'text-gray-400'}`}>
                      Paso {step.id}
                    </p>
                    <p className={`text-[11px] font-bold uppercase tracking-wider max-w-[100px] leading-tight ${isActive ? 'text-bolivar-dark' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Datos del Tomador</h3>
                    <p className="text-gray-500">Información de la persona que contrata el seguro.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Identificación*</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all"
                        value={formData.tomador.idType}
                        onChange={(e) => setFormData(prev => ({ ...prev, tomador: { ...prev.tomador, idType: e.target.value } }))}
                      >
                        <option value="">Seleccionar...</option>
                        <option>Cédula de ciudadania</option>
                        <option>Cedula de extranjeria</option>
                        <option>Pasaporte</option>
                        <option>NIT</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de Identificación*</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all" 
                        placeholder="Ingresar número"
                        value={formData.tomador.id}
                        onChange={(e) => handleIdInput(e.target.value, 'tomador')}
                        onBlur={(e) => handleIdBlur(e.target.value, 'tomador')}
                      />
                    </div>

                    {/* Dynamic fields that appear after ID is entered and validated */}
                    <AnimatePresence>
                      {formData.tomador.idType && formData.tomador.id.length >= 6 && formData.tomador.isIdValidated && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
                        >
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombres*</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all" 
                              placeholder="Nombres"
                              value={formData.tomador.firstName}
                              onChange={(e) => setFormData(prev => ({ ...prev, tomador: { ...prev.tomador, firstName: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apellidos*</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all" 
                              placeholder="Apellidos"
                              value={formData.tomador.lastName}
                              onChange={(e) => setFormData(prev => ({ ...prev, tomador: { ...prev.tomador, lastName: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Correo Electrónico*</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all" 
                              placeholder="correo@ejemplo.com"
                              value={formData.tomador.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, tomador: { ...prev.tomador, email: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Teléfono de Contacto*</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all" 
                              placeholder="Número de teléfono"
                              value={formData.tomador.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, tomador: { ...prev.tomador, phone: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Envío</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-200 border border-gray-200 text-gray-500 cursor-not-allowed outline-none" 
                              value={formData.tomador.shippingType}
                              readOnly
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Vehículo</h3>
                    <p className="text-gray-500">Detalles técnicos del vehículo a asegurar.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="max-w-md space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Placa*</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-bolivar-green outline-none transition-all uppercase" 
                        placeholder="EMQ706"
                        value={formData.vehiculo.plate}
                        onChange={(e) => handlePlateChange(e.target.value)}
                      />
                    </div>

                    {vehicleFound && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Marca*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.brand}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, brand: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Modelo*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.model}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, model: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Año*</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                            value={formData.vehiculo.year}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, year: e.target.value } }))}
                          >
                            <option value="">Seleccionar...</option>
                            {Array.from({ length: 30 }, (_, i) => 2026 - i).map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, type: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Uso*</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                            value={formData.vehiculo.use}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, use: e.target.value } }))}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="Particular familiar">Particular familiar</option>
                            <option value="Público">Público</option>
                            <option value="Carga">Carga</option>
                            <option value="Motocicleta">Motocicleta</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Color*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.color}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, color: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de motor*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all text-xs" 
                            value={formData.vehiculo.engineNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, engineNumber: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Número de chasis*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all text-xs" 
                            value={formData.vehiculo.chassisNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, chassisNumber: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Alt. Cobertura*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.coverage}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, coverage: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">0km</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.isNew}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, isNew: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suma asegurada*</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            value={formData.vehiculo.insuredAmount}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, insuredAmount: e.target.value } }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subproducto*</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                            value={formData.vehiculo.subproducto}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, subproducto: e.target.value as any } }))}
                          >
                            <option value="Opciones">Opciones</option>
                            <option value="Oferta Verde">Oferta Verde</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Asegurado</h3>
                    <p className="text-gray-500">¿Quién será la persona protegida por esta póliza?</p>
                  </div>
                  <div className="bg-bolivar-green/5 p-6 rounded-2xl border border-bolivar-green/10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-bolivar-dark">¿Es el mismo tomador?</p>
                          <p className="text-sm text-gray-500">Marca esta opción si el tomador es el mismo asegurado.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 border-gray-200 rounded-full appearance-none cursor-pointer checked:translate-x-6 checked:border-bolivar-green" 
                          checked={formData.asegurado.isSameAsTomador}
                          onChange={(e) => {
                            const isSame = e.target.checked;
                            setFormData(prev => ({ 
                              ...prev, 
                              asegurado: { 
                                ...prev.asegurado, 
                                isSameAsTomador: isSame,
                                isIdValidated: isSame,
                                ...(isSame ? {
                                  idType: prev.tomador.idType,
                                  id: prev.tomador.id,
                                  firstName: prev.tomador.firstName,
                                  lastName: prev.tomador.lastName
                                } : {
                                  idType: '',
                                  id: '',
                                  firstName: '',
                                  lastName: ''
                                })
                              } 
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-bolivar-green/10">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <span className="text-red-500">*</span> Tipo Documento Asegurado
                        </label>
                        <select 
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.asegurado.isSameAsTomador ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                          value={formData.asegurado.idType}
                          onChange={(e) => setFormData(prev => ({ ...prev, asegurado: { ...prev.asegurado, idType: e.target.value } }))}
                          disabled={formData.asegurado.isSameAsTomador}
                        >
                          <option value="">Seleccionar...</option>
                          <option>Cédula de ciudadania</option>
                          <option>Cedula de extranjeria</option>
                          <option>Pasaporte</option>
                          <option>NIT</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <span className="text-red-500">*</span> Nro. Documento Asegurado
                        </label>
                        <input 
                          type="text" 
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.asegurado.isSameAsTomador ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                          placeholder="Número de documento"
                          value={formData.asegurado.id}
                          onChange={(e) => handleIdInput(e.target.value, 'asegurado')}
                          onBlur={(e) => handleIdBlur(e.target.value, 'asegurado')}
                          disabled={formData.asegurado.isSameAsTomador}
                        />
                      </div>
                      
                      <AnimatePresence>
                        {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                          >
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="text-red-500">*</span> Nombre Asegurado
                              </label>
                              <input 
                                type="text" 
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.asegurado.isSameAsTomador ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                                placeholder="Nombres"
                                value={formData.asegurado.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, asegurado: { ...prev.asegurado, firstName: e.target.value } }))}
                                disabled={formData.asegurado.isSameAsTomador}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="text-red-500">*</span> Apellido Asegurado
                              </label>
                              <input 
                                type="text" 
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.asegurado.isSameAsTomador ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                                placeholder="Apellidos"
                                value={formData.asegurado.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, asegurado: { ...prev.asegurado, lastName: e.target.value } }))}
                                disabled={formData.asegurado.isSameAsTomador}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Conductor Habitual Section */}
                    {formData.vehiculo.use.toLowerCase().includes('particular') && formData.asegurado.id && (formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-10 border-t border-bolivar-green/10"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <UserCircle size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Conductor Habitual</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                              value={`${formData.asegurado.firstName} ${formData.asegurado.lastName}`}
                              onChange={(e) => {
                                const [first, ...last] = e.target.value.split(' ');
                                setFormData(prev => ({ 
                                  ...prev, 
                                  asegurado: { 
                                    ...prev.asegurado, 
                                    firstName: first || '', 
                                    lastName: last.join(' ') || '' 
                                  } 
                                }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identificación</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                              value={`${formData.asegurado.id}`}
                              onChange={(e) => setFormData(prev => ({ ...prev, asegurado: { ...prev.asegurado, id: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Género</label>
                            <div className="flex gap-4 py-2">
                              {['Masculino', 'Femenino'].map((g) => (
                                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="gender" 
                                    checked={formData.conductorHabitual.gender === g}
                                    onChange={() => setFormData(prev => ({ ...prev, conductorHabitual: { ...prev.conductorHabitual, gender: g } }))}
                                  /> {g}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado Civil</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                              value={formData.conductorHabitual.civilStatus}
                              onChange={(e) => setFormData(prev => ({ ...prev, conductorHabitual: { ...prev.conductorHabitual, civilStatus: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              <option>Soltero(a)</option>
                              <option>Casado(a)</option>
                              <option>Unión Libre</option>
                              <option>Divorciado(a)</option>
                              <option>Viudo(a)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha de Nacimiento</label>
                            <input 
                              type="date" 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                              value={formData.conductorHabitual.birthDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, conductorHabitual: { ...prev.conductorHabitual, birthDate: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ocupación</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all"
                              value={formData.conductorHabitual.occupation}
                              onChange={(e) => setFormData(prev => ({ ...prev, conductorHabitual: { ...prev.conductorHabitual, occupation: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              <option>Empleado</option>
                              <option>Independiente</option>
                              <option>Hogar</option>
                              <option>Estudiante</option>
                              <option>Pensionado</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Accesorios Toggle */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <div className="mt-10 pt-10 border-t border-bolivar-green/10">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                              <ClipboardList size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-bolivar-dark">¿Deseas incluir accesorios?</p>
                              <p className="text-sm text-gray-500">Agrega rines, pantallas, blindaje y más a tu póliza.</p>
                            </div>
                          </div>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                            <input 
                              type="checkbox" 
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 border-gray-200 rounded-full appearance-none cursor-pointer checked:translate-x-6 checked:border-bolivar-green" 
                              checked={includeAccesorios}
                              onChange={(e) => {
                                setIncludeAccesorios(e.target.checked);
                                if (!e.target.checked) {
                                  setFormData(prev => ({ ...prev, accesorios: [] }));
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accesorios Section */}
                    <AnimatePresence>
                      {includeAccesorios && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Lista de Accesorios</h4>
                            </div>
                            <button 
                              onClick={() => {
                                const newAcc = {
                                  id: Math.random().toString(36).substr(2, 9),
                                  name: '',
                                  isOriginal: true,
                                  value: 0,
                                  brand: ''
                                };
                                setFormData(prev => ({ ...prev, accesorios: [...prev.accesorios, newAcc] }));
                              }}
                              className="text-sm font-bold text-bolivar-green hover:underline flex items-center gap-1"
                            >
                              + Agregar Accesorio
                            </button>
                          </div>

                          <div className="space-y-4">
                            {formData.accesorios.map((acc, index) => (
                              <motion.div 
                                key={acc.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                              >
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Accesorio</label>
                                  <select 
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-bolivar-green"
                                    value={acc.name}
                                    onChange={(e) => {
                                      const newAccs = [...formData.accesorios];
                                      newAccs[index].name = e.target.value;
                                      setFormData(prev => ({ ...prev, accesorios: newAccs }));
                                    }}
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option>Rines de lujo</option>
                                    <option>Radio / Pantalla</option>
                                    <option>Sensores de reversa</option>
                                    <option>Cámara de seguridad</option>
                                    <option>Exploradoras</option>
                                    <option>Blindaje</option>
                                    <option>Estribos</option>
                                    <option>Tiro de arrastre</option>
                                    <option>Barras de techo</option>
                                    <option>Películas de seguridad</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Es Original?</label>
                                  <div className="flex gap-4 py-2">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`original-${acc.id}`} 
                                        checked={acc.isOriginal} 
                                        onChange={() => {
                                          const newAccs = [...formData.accesorios];
                                          newAccs[index].isOriginal = true;
                                          setFormData(prev => ({ ...prev, accesorios: newAccs }));
                                        }}
                                      /> Si
                                    </label>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`original-${acc.id}`} 
                                        checked={!acc.isOriginal} 
                                        onChange={() => {
                                          const newAccs = [...formData.accesorios];
                                          newAccs[index].isOriginal = false;
                                          setFormData(prev => ({ ...prev, accesorios: newAccs }));
                                        }}
                                      /> No
                                    </label>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor del Accesorio</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-bolivar-green"
                                    placeholder="0"
                                    value={acc.value || ''}
                                    onChange={(e) => {
                                      const newAccs = [...formData.accesorios];
                                      newAccs[index].value = parseFloat(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, accesorios: newAccs }));
                                    }}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button 
                                    onClick={() => {
                                      setFormData(prev => ({ 
                                        ...prev, 
                                        accesorios: prev.accesorios.filter(a => a.id !== acc.id) 
                                      }));
                                    }}
                                    className="text-red-400 hover:text-red-600 p-2"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Totals and Validation */}
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor total accesorios a tarifar (No originales)</p>
                                <p className="font-bold text-bolivar-dark">
                                  ${formData.accesorios.filter(a => !a.isOriginal).reduce((sum, a) => sum + a.value, 0).toLocaleString('es-CO')}
                                </p>
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor total accesorios</p>
                                <p className="text-xl font-bold text-bolivar-green">
                                  ${formData.accesorios.reduce((sum, a) => sum + a.value, 0).toLocaleString('es-CO')}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center">
                              {(() => {
                                const totalValue = formData.accesorios.reduce((sum, a) => sum + a.value, 0);
                                const commercialValue = parseFloat(formData.vehiculo.insuredAmount.replace(/\./g, '').replace(/,/g, '.')) || 0;
                                const percentage = commercialValue > 0 ? (totalValue / commercialValue) * 100 : 0;
                                const isOverLimit = percentage > 20;

                                return (
                                  <div className={`p-4 rounded-xl border ${isOverLimit ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-1">Validación de Límite (Máx 20%)</p>
                                    <div className="flex justify-between items-end">
                                      <p className="text-sm font-medium">Porcentaje actual: <span className="font-bold">{percentage.toFixed(2)}%</span></p>
                                      {isOverLimit && <p className="text-[10px] font-bold uppercase">Excede el límite permitido</p>}
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-500 ${isOverLimit ? 'bg-red-500' : 'bg-bolivar-green'}`} 
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Ciudad de movilización Section */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <div className="mt-10 pt-10 border-t border-bolivar-green/10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <MapPin size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Ciudad de movilización</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                              <span className="text-red-500">*</span> Ciudad de residencia
                            </label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.asegurado.ciudadResidencia}
                              onChange={(e) => setFormData(prev => ({ ...prev, asegurado: { ...prev.asegurado, ciudadResidencia: e.target.value } }))}
                            >
                              <option value="">Seleccionar ciudad...</option>
                              <option>Bogotá</option>
                              <option>Cali</option>
                              <option>Medellin</option>
                              <option>Bucaramanga</option>
                              <option>Barranquilla</option>
                              <option>Cartagena</option>
                            </select>
                            <p className="text-[10px] text-gray-400 italic mt-1">Esta información se persistirá de forma interna en el proceso.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Beneficiario Oneroso Section */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <div className="mt-10 pt-10 border-t border-bolivar-green/10">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                              <CreditCard size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-bolivar-dark">¿Es beneficiario oneroso?</p>
                              <p className="text-sm text-gray-500">Marca esta opción si existe un acreedor prendario sobre el vehículo.</p>
                            </div>
                          </div>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                            <input 
                              type="checkbox" 
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 border-gray-200 rounded-full appearance-none cursor-pointer checked:translate-x-6 checked:border-bolivar-green" 
                              checked={formData.beneficiarioOneroso.isBeneficiario}
                              onChange={(e) => {
                                const isBen = e.target.checked;
                                setFormData(prev => ({ 
                                  ...prev, 
                                  beneficiarioOneroso: { 
                                    ...prev.beneficiarioOneroso, 
                                    isBeneficiario: isBen,
                                    ...(isBen ? {} : { isSameAsAsegurado: false, idType: '', id: '', name: '' })
                                  } 
                                }));
                              }}
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {formData.beneficiarioOneroso.isBeneficiario && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-6"
                            >
                              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-bolivar-green/20 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-bolivar-green/5 rounded-full flex items-center justify-center text-bolivar-green">
                                    <Users size={16} />
                                  </div>
                                  <p className="text-sm font-medium text-bolivar-dark">¿Es el mismo asegurado?</p>
                                </div>
                                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-gray-200">
                                  <input 
                                    type="checkbox" 
                                    className="absolute w-5 h-5 transition duration-200 ease-in-out transform bg-white border-2 border-gray-200 rounded-full appearance-none cursor-pointer checked:translate-x-5 checked:border-bolivar-green" 
                                    checked={formData.beneficiarioOneroso.isSameAsAsegurado}
                                    onChange={(e) => {
                                      const isSame = e.target.checked;
                                      setFormData(prev => ({ 
                                        ...prev, 
                                        beneficiarioOneroso: { 
                                          ...prev.beneficiarioOneroso, 
                                          isSameAsAsegurado: isSame,
                                          ...(isSame ? {
                                            idType: prev.asegurado.idType,
                                            id: prev.asegurado.id,
                                            name: `${prev.asegurado.firstName} ${prev.asegurado.lastName}`
                                          } : {
                                            idType: '',
                                            id: '',
                                            name: ''
                                          })
                                        } 
                                      }));
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo Documento</label>
                                  <select 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.beneficiarioOneroso.isSameAsAsegurado ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                                    value={formData.beneficiarioOneroso.idType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, beneficiarioOneroso: { ...prev.beneficiarioOneroso, idType: e.target.value } }))}
                                    disabled={formData.beneficiarioOneroso.isSameAsAsegurado}
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option>Cédula de ciudadania</option>
                                    <option>NIT</option>
                                    <option>Cedula de extranjeria</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nro. Documento</label>
                                  <input 
                                    type="text" 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.beneficiarioOneroso.isSameAsAsegurado ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                                    placeholder="Número de documento"
                                    value={formData.beneficiarioOneroso.id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, beneficiarioOneroso: { ...prev.beneficiarioOneroso, id: e.target.value } }))}
                                    disabled={formData.beneficiarioOneroso.isSameAsAsegurado}
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombre / Razón Social</label>
                                  <input 
                                    type="text" 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.beneficiarioOneroso.isSameAsAsegurado ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-bolivar-green'}`}
                                    placeholder="Nombre completo o razón social de la entidad"
                                    value={formData.beneficiarioOneroso.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, beneficiarioOneroso: { ...prev.beneficiarioOneroso, name: e.target.value } }))}
                                    disabled={formData.beneficiarioOneroso.isSameAsAsegurado}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Coberturas Section */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-10 border-t border-bolivar-green/10"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <Shield size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Coberturas</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                              <span className="text-red-500">*</span> Alternativa de cobertura
                            </label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.coberturas.alternativa}
                              onChange={(e) => setFormData(prev => ({ ...prev, coberturas: { ...prev.coberturas, alternativa: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              {(formData.vehiculo.subproducto === 'Opciones' || formData.vehiculo.subproducto === 'Oferta Verde') ? (
                                <>
                                  <option value="C1">C1 - Cobertura Integral</option>
                                  <option value="C2">C2 - Cobertura Básica</option>
                                </>
                              ) : (
                                <option value="43">43 - Opciones Autos</option>
                              )}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${formData.coberturas.alternativa === '43' ? 'text-gray-500' : 'text-gray-300'}`}>
                              Opción autos
                            </label>
                            <select 
                              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${formData.coberturas.alternativa === '43' ? 'bg-white border-gray-200 focus:border-bolivar-green' : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'}`}
                              value={formData.coberturas.opcionAutos}
                              onChange={(e) => setFormData(prev => ({ ...prev, coberturas: { ...prev.coberturas, opcionAutos: e.target.value } }))}
                              disabled={formData.coberturas.alternativa !== '43'}
                            >
                              <option value="">Seleccionar...</option>
                              <option>Opción 1 - Full</option>
                              <option>Opción 2 - Básica</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                              <span className={`text-xs font-bold uppercase tracking-widest ${formData.coberturas.opcionAutos || formData.vehiculo.subproducto === 'Oferta Verde' ? 'text-gray-600' : 'text-gray-300'}`}>Pequeños Accesorios</span>
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 accent-bolivar-green disabled:opacity-30"
                                checked={formData.coberturas.pequeñosAccesorios}
                                onChange={(e) => setFormData(prev => ({ ...prev, coberturas: { ...prev.coberturas, pequeñosAccesorios: e.target.checked } }))}
                                disabled={!formData.coberturas.opcionAutos && formData.vehiculo.subproducto !== 'Oferta Verde'}
                              />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                              <span className={`text-xs font-bold uppercase tracking-widest ${formData.coberturas.opcionAutos ? 'text-gray-600' : 'text-gray-300'}`}>Movilidad 360</span>
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 accent-bolivar-green disabled:opacity-30"
                                checked={formData.coberturas.movilidad360}
                                onChange={(e) => setFormData(prev => ({ ...prev, coberturas: { ...prev.coberturas, movilidad360: e.target.checked } }))}
                                disabled={!formData.coberturas.opcionAutos}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className={`text-[10px] font-bold uppercase tracking-widest ${formData.coberturas.opcionAutos || formData.vehiculo.subproducto === 'Oferta Verde' ? 'text-gray-500' : 'text-gray-300'}`}>Asistencia</label>
                              <select 
                                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition-all ${formData.coberturas.opcionAutos || formData.vehiculo.subproducto === 'Oferta Verde' ? 'bg-white border-gray-200 focus:border-bolivar-green' : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'}`}
                                value={formData.coberturas.asistencia}
                                onChange={(e) => setFormData(prev => ({ ...prev, coberturas: { ...prev.coberturas, asistencia: e.target.value } }))}
                                disabled={!formData.coberturas.opcionAutos && formData.vehiculo.subproducto !== 'Oferta Verde'}
                              >
                                <option value="">Seleccionar...</option>
                                <option>Básica</option>
                                <option>Plus</option>
                                <option>VIP</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Responsabilidad Civil Section */}
                    {formData.coberturas.alternativa && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-10 border-t border-bolivar-green/10"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <Scale size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Datos de Responsabilidad Civil</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(formData.vehiculo.subproducto === 'Opciones' || formData.vehiculo.subproducto === 'Oferta Verde') ? (
                            <>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                  <span className="text-red-500">*</span> R.C. Extracontractual
                                </label>
                                <select 
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                                  value={formData.responsabilidadCivil.extracontractual}
                                  onChange={(e) => setFormData(prev => ({ ...prev, responsabilidadCivil: { ...prev.responsabilidadCivil, extracontractual: e.target.value } }))}
                                >
                                  <option value="">Seleccionar...</option>
                                  <option>2.000 Millones</option>
                                  <option>3.000 Millones</option>
                                  <option>4.000 Millones</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                  <span className="text-red-500">*</span> Deducible cobertura R.C.
                                </label>
                                <select 
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                                  value={formData.responsabilidadCivil.deducibleRC}
                                  onChange={(e) => setFormData(prev => ({ ...prev, responsabilidadCivil: { ...prev.responsabilidadCivil, deducibleRC: e.target.value } }))}
                                >
                                  <option value="">Seleccionar...</option>
                                  <option>Sin Deducible</option>
                                  <option>10% Min 1 SMMLV</option>
                                </select>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="text-red-500">*</span> R.C. Suplementaria
                              </label>
                              <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                                value={formData.responsabilidadCivil.suplementaria}
                                onChange={(e) => setFormData(prev => ({ ...prev, responsabilidadCivil: { ...prev.responsabilidadCivil, suplementaria: e.target.value } }))}
                              >
                                <option value="">Seleccionar...</option>
                                <option>500 Millones</option>
                                <option>1.000 Millones</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Deducibles Section */}
                    {(formData.responsabilidadCivil.extracontractual || formData.responsabilidadCivil.suplementaria) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-10 border-t border-bolivar-green/10"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <DollarSign size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Deducibles</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deducible parcial daños</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.deducibles.parcialDaños}
                              onChange={(e) => setFormData(prev => ({ ...prev, deducibles: { ...prev.deducibles, parcialDaños: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              <option>10% Min 1 SMMLV</option>
                              <option>Sin Deducible</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deducible cobertura hurto</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.deducibles.coberturaHurto}
                              onChange={(e) => setFormData(prev => ({ ...prev, deducibles: { ...prev.deducibles, coberturaHurto: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              <option>10% Min 1 SMMLV</option>
                              <option>Sin Deducible</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deducible total daños</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.deducibles.totalDaños}
                              onChange={(e) => setFormData(prev => ({ ...prev, deducibles: { ...prev.deducibles, totalDaños: e.target.value } }))}
                            >
                              <option value="">Seleccionar...</option>
                              <option>10% Min 1 SMMLV</option>
                              <option>Sin Deducible</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Observaciones Section */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <div className="mt-10 pt-10 border-t border-bolivar-green/10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <MessageSquare size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Observaciones</h4>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="text-red-500">*</span> Observaciones de la solicitud
                          </label>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white min-h-[120px]"
                            placeholder="Ingresa observaciones relevantes..."
                            value={formData.observaciones}
                            onChange={(e) => {
                              if (e.target.value.length <= 500) {
                                setFormData(prev => ({ ...prev, observaciones: e.target.value }));
                              }
                            }}
                          />
                          <div className="flex justify-between mt-1">
                            <p className="text-[10px] text-gray-400 italic">Se reserva espacio para caracteres de re-enganche futuro.</p>
                            <p className={`text-[10px] font-bold ${formData.observaciones.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                              {formData.observaciones.length} / 500
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ciudad de Movilización Section */}
                    {(formData.asegurado.isIdValidated || formData.asegurado.isSameAsTomador) && formData.asegurado.id && (
                      <div className="mt-10 pt-10 border-t border-bolivar-green/10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green">
                            <MapPin size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-bolivar-dark uppercase tracking-wide">Ciudad de Movilización</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                              <span className="text-red-500">*</span> Ciudad de movilización
                            </label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-bolivar-green transition-all bg-white"
                              value={formData.asegurado.ciudadMovilizacion}
                              onChange={(e) => {
                                const city = e.target.value;
                                setFormData(prev => ({ 
                                  ...prev, 
                                  asegurado: { 
                                    ...prev.asegurado, 
                                    ciudadMovilizacion: city,
                                    ciudadResidencia: city // Persists internally as residence city
                                  } 
                                }));
                              }}
                            >
                              <option value="">Seleccionar...</option>
                              <option value="Bogotá">Bogotá</option>
                              <option value="Cali">Cali</option>
                              <option value="Medellin">Medellin</option>
                              <option value="Bucaramanga">Bucaramanga</option>
                              <option value="Barranquilla">Barranquilla</option>
                              <option value="Cartagena">Cartagena</option>
                            </select>
                            <p className="text-[10px] text-gray-400 italic mt-1">Esta ciudad será asociada internamente como tu ciudad de residencia.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Beneficiarios</h3>
                    <p className="text-gray-500">Personas que recibirán la indemnización en caso de siniestro.</p>
                  </div>
                  <div className="space-y-6">
                    {formData.beneficiarios.map((beneficiario, index) => (
                      <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                        <div className="flex-1 space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombre Beneficiario</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all" 
                            placeholder="Nombre completo"
                            value={beneficiario.name}
                            onChange={(e) => {
                              const newBeneficiarios = [...formData.beneficiarios];
                              newBeneficiarios[index].name = e.target.value;
                              setFormData(prev => ({ ...prev, beneficiarios: newBeneficiarios }));
                            }}
                          />
                        </div>
                        <div className="w-32 space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">%</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-bolivar-green transition-all pr-8" 
                              placeholder="100"
                              value={beneficiario.percentage}
                              onChange={(e) => {
                                const newBeneficiarios = [...formData.beneficiarios];
                                newBeneficiarios[index].percentage = e.target.value;
                                setFormData(prev => ({ ...prev, beneficiarios: newBeneficiarios }));
                              }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                          </div>
                        </div>
                        {formData.beneficiarios.length > 1 && (
                          <button 
                            onClick={() => {
                              const newBeneficiarios = formData.beneficiarios.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, beneficiarios: newBeneficiarios }));
                            }}
                            className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-4">
                      <button 
                        onClick={() => {
                          const currentTotal = formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
                          if (currentTotal < 100) {
                            setFormData(prev => ({ 
                              ...prev, 
                              beneficiarios: [...prev.beneficiarios, { name: '', percentage: '' }] 
                            }));
                          }
                        }}
                        disabled={formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0) >= 100}
                        className={`font-bold text-sm flex items-center gap-2 transition-all ${
                          formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0) >= 100 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-bolivar-green hover:underline'
                        }`}
                      >
                        <Plus size={16} />
                        Agregar otro beneficiario
                      </button>

                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total:</span>
                        <span className={`text-lg font-black ${
                          formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0) === 100 
                            ? 'text-bolivar-green' 
                            : 'text-orange-500'
                        }`}>
                          {formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0)}%
                        </span>
                      </div>
                    </div>

                    {formData.beneficiarios.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0) !== 100 && (
                      <p className="text-xs text-orange-500 font-medium flex items-center gap-1 mt-2">
                        <AlertCircle size={12} />
                        La sumatoria de los porcentajes debe ser exactamente 100% para continuar.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Documentación</h3>
                    <p className="text-gray-500">Carga los documentos necesarios para finalizar tu solicitud.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Required Documents */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Documentos Requeridos</h4>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-bolivar-green/10 rounded-lg flex items-center justify-center text-bolivar-green">
                                <FileText size={16} />
                              </div>
                              <p className="text-sm font-bold text-bolivar-dark">Solicitud cliente - intermediario*</p>
                            </div>
                            {formData.documentacion.solicitudCliente && <CheckCircle size={16} className="text-bolivar-green" />}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="solicitud-cliente"
                            onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, solicitudCliente: e.target.files?.[0] || null } }))}
                          />
                          <label 
                            htmlFor="solicitud-cliente"
                            className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                          >
                            {formData.documentacion.solicitudCliente ? formData.documentacion.solicitudCliente.name : 'Subir Archivo'}
                          </label>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-bolivar-green/10 rounded-lg flex items-center justify-center text-bolivar-green">
                                <FileText size={16} />
                              </div>
                              <p className="text-sm font-bold text-bolivar-dark">Documento Identidad (Frontal)*</p>
                            </div>
                            {formData.documentacion.idFront && <CheckCircle size={16} className="text-bolivar-green" />}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="id-front"
                            onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, idFront: e.target.files?.[0] || null } }))}
                          />
                          <label 
                            htmlFor="id-front"
                            className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                          >
                            {formData.documentacion.idFront ? formData.documentacion.idFront.name : 'Subir Archivo'}
                          </label>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-bolivar-green/10 rounded-lg flex items-center justify-center text-bolivar-green">
                                <FileText size={16} />
                              </div>
                              <p className="text-sm font-bold text-bolivar-dark">Documento Identidad (Respaldo)*</p>
                            </div>
                            {formData.documentacion.idBack && <CheckCircle size={16} className="text-bolivar-green" />}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="id-back"
                            onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, idBack: e.target.files?.[0] || null } }))}
                          />
                          <label 
                            htmlFor="id-back"
                            className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                          >
                            {formData.documentacion.idBack ? formData.documentacion.idBack.name : 'Subir Archivo'}
                          </label>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-bolivar-green/10 rounded-lg flex items-center justify-center text-bolivar-green">
                                <FileText size={16} />
                              </div>
                              <p className="text-sm font-bold text-bolivar-dark">Tarjeta de Propiedad*</p>
                            </div>
                            {formData.documentacion.tarjetaPropiedad && <CheckCircle size={16} className="text-bolivar-green" />}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="tarjeta-propiedad"
                            onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, tarjetaPropiedad: e.target.files?.[0] || null } }))}
                          />
                          <label 
                            htmlFor="tarjeta-propiedad"
                            className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                          >
                            {formData.documentacion.tarjetaPropiedad ? formData.documentacion.tarjetaPropiedad.name : 'Subir Archivo'}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Conditional/Optional Documents */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Documentos Adicionales</h4>
                      
                      <div className="space-y-4">
                        {formData.vehiculo.isNew === 'Si' && (
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                  <FileText size={16} />
                                </div>
                                <p className="text-sm font-bold text-bolivar-dark">Factura del vehículo (0 km)*</p>
                              </div>
                              {formData.documentacion.facturaVehiculo && <CheckCircle size={16} className="text-bolivar-green" />}
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              id="factura-vehiculo"
                              onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, facturaVehiculo: e.target.files?.[0] || null } }))}
                            />
                            <label 
                              htmlFor="factura-vehiculo"
                              className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                            >
                              {formData.documentacion.facturaVehiculo ? formData.documentacion.facturaVehiculo.name : 'Subir Archivo'}
                            </label>
                          </div>
                        )}

                        {formData.accesorios.length > 0 && (
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                  <FileText size={16} />
                                </div>
                                <p className="text-sm font-bold text-bolivar-dark">Factura accesorios y/o adecuaciones*</p>
                              </div>
                              {formData.documentacion.facturaAccesorios && <CheckCircle size={16} className="text-bolivar-green" />}
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              id="factura-accesorios"
                              onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, facturaAccesorios: e.target.files?.[0] || null } }))}
                            />
                            <label 
                              htmlFor="factura-accesorios"
                              className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                            >
                              {formData.documentacion.facturaAccesorios ? formData.documentacion.facturaAccesorios.name : 'Subir Archivo'}
                            </label>
                          </div>
                        )}

                        {formData.accesorios.some(a => a.name === 'Blindaje') && (
                          <>
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                    <FileText size={16} />
                                  </div>
                                  <p className="text-sm font-bold text-bolivar-dark">Factura del blindaje*</p>
                                </div>
                                {formData.documentacion.facturaBlindaje && <CheckCircle size={16} className="text-bolivar-green" />}
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                id="factura-blindaje"
                                onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, facturaBlindaje: e.target.files?.[0] || null } }))}
                              />
                              <label 
                                htmlFor="factura-blindaje"
                                className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                              >
                                {formData.documentacion.facturaBlindaje ? formData.documentacion.facturaBlindaje.name : 'Subir Archivo'}
                              </label>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                    <FileText size={16} />
                                  </div>
                                  <p className="text-sm font-bold text-bolivar-dark">Resolución del blindaje (Opcional)</p>
                                </div>
                                {formData.documentacion.resolucionBlindaje && <CheckCircle size={16} className="text-bolivar-green" />}
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                id="resolucion-blindaje"
                                onChange={(e) => setFormData(prev => ({ ...prev, documentacion: { ...prev.documentacion, resolucionBlindaje: e.target.files?.[0] || null } }))}
                              />
                              <label 
                                htmlFor="resolucion-blindaje"
                                className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 cursor-pointer transition-all"
                              >
                                {formData.documentacion.resolucionBlindaje ? formData.documentacion.resolucionBlindaje.name : 'Subir Archivo'}
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {!isStepValid(5) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 mt-4"
                        >
                          <AlertCircle className="text-red-500 shrink-0" size={18} />
                          <p className="text-xs text-red-600 font-medium leading-relaxed">
                            Para continuar, debes cargar todos los documentos marcados con asterisco (*). 
                            Asegúrate de haber adjuntado la Solicitud, Documento de Identidad (ambas caras) y Tarjeta de Propiedad.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-8">
                  <div className="border-l-4 border-bolivar-green pl-4">
                    <h3 className="text-2xl font-bold text-bolivar-dark">Resumen de la Solicitud</h3>
                    <p className="text-gray-500">Verifica que toda la información sea correcta antes de emitir.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Plan & Value */}
                    <div className="md:col-span-2 bg-bolivar-green/5 rounded-2xl p-6 border border-bolivar-green/10 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subproducto Seleccionado</p>
                        <p className="text-xl font-bold text-bolivar-green">{formData.vehiculo.subproducto}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Valor Comercial Vehículo</p>
                        <p className="text-2xl font-bold text-bolivar-dark">${formData.vehiculo.insuredAmount}</p>
                      </div>
                    </div>

                    {/* Tomador & Asegurado */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-bolivar-green mb-2">
                        <User size={18} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Tomador</h4>
                        <button onClick={() => setCurrentStep(1)} className="text-bolivar-green hover:underline text-[10px] font-bold uppercase ml-auto">Editar</button>
                      </div>
                      <div>
                        <p className="font-bold text-bolivar-dark">{formData.tomador.firstName} {formData.tomador.lastName}</p>
                        <p className="text-sm text-gray-500">{formData.tomador.idType}: {formData.tomador.id}</p>
                        <p className="text-sm text-gray-500">{formData.tomador.email} | {formData.tomador.phone}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-bolivar-green mb-2">
                        <Users size={18} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Asegurado</h4>
                        <button onClick={() => setCurrentStep(3)} className="text-bolivar-green hover:underline text-[10px] font-bold uppercase ml-auto">Editar</button>
                      </div>
                      <div>
                        <p className="font-bold text-bolivar-dark">{formData.asegurado.firstName} {formData.asegurado.lastName}</p>
                        <p className="text-sm text-gray-500">{formData.asegurado.idType}: {formData.asegurado.id}</p>
                        <p className="text-sm text-gray-500">Ciudad: {formData.asegurado.ciudadResidencia}</p>
                      </div>
                    </div>

                    {/* Vehículo */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-bolivar-green mb-2">
                        <Car size={18} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Vehículo</h4>
                        <button onClick={() => setCurrentStep(2)} className="text-bolivar-green hover:underline text-[10px] font-bold uppercase ml-auto">Editar</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Placa</p>
                          <p className="text-sm font-bold">{formData.vehiculo.plate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Marca/Modelo</p>
                          <p className="text-sm">{formData.vehiculo.brand} - {formData.vehiculo.model}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Uso</p>
                          <p className="text-sm">{formData.vehiculo.use}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Color</p>
                          <p className="text-sm">{formData.vehiculo.color}</p>
                        </div>
                      </div>
                    </div>

                    {/* Coberturas & RC */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-bolivar-green mb-2">
                        <Shield size={18} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Coberturas</h4>
                        <button onClick={() => setCurrentStep(3)} className="text-bolivar-green hover:underline text-[10px] font-bold uppercase ml-auto">Editar</button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-bold">Alternativa:</span> {formData.coberturas.alternativa}</p>
                        {formData.coberturas.opcionAutos && <p className="text-sm"><span className="font-bold">Opción:</span> {formData.coberturas.opcionAutos}</p>}
                        <p className="text-sm">
                          <span className="font-bold">R.C.:</span> {formData.responsabilidadCivil.extracontractual || formData.responsabilidadCivil.suplementaria}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.coberturas.pequeñosAccesorios && <span className="px-2 py-1 bg-bolivar-green/10 text-bolivar-green text-[10px] font-bold rounded-md">Pequeños Accesorios</span>}
                          {formData.coberturas.movilidad360 && <span className="px-2 py-1 bg-bolivar-green/10 text-bolivar-green text-[10px] font-bold rounded-md">Movilidad 360</span>}
                        </div>
                      </div>
                    </div>

                    {/* Beneficiarios */}
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 text-bolivar-green mb-4">
                        <ClipboardList size={18} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Beneficiarios</h4>
                        <button onClick={() => setCurrentStep(4)} className="text-bolivar-green hover:underline text-[10px] font-bold uppercase ml-auto">Editar</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.beneficiarios.map((b, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm font-medium">{b.name}</span>
                            <span className="text-sm font-bold text-bolivar-green">{b.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center mt-1">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-bolivar-green focus:ring-bolivar-green transition-all cursor-pointer"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        Confirmo que la información suministrada es verídica y acepto los <span className="font-bold text-bolivar-green underline decoration-bolivar-green/30 underline-offset-4 group-hover:decoration-bolivar-green transition-all">términos y condiciones</span> de Seguros Bolívar para la emisión de esta póliza.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bolivar-dark/40 backdrop-blur-sm"
                >
                  <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center space-y-6 border border-gray-100">
                    <div className="w-20 h-20 bg-bolivar-green/10 rounded-full flex items-center justify-center text-bolivar-green mx-auto mb-2">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-bolivar-dark">¡Solicitud Exitosa!</h3>
                    <div className="space-y-2">
                      <p className="text-gray-500">Tu solicitud ha sido procesada correctamente.</p>
                      <div className="bg-gray-50 py-3 px-6 rounded-2xl border border-gray-100 inline-block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Número de Radicado</p>
                        <p className="text-2xl font-black text-bolivar-green tracking-tighter">{radicado}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Se ha descargado un PDF con el resumen de tu solicitud. Un asesor se contactará contigo pronto.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full py-4 bg-bolivar-green text-white rounded-full font-bold shadow-lg shadow-bolivar-green/20 hover:bg-bolivar-green/90 transition-all"
                    >
                      Finalizar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 font-bold transition-colors ${
                    currentStep === 1 ? 'text-gray-300' : 'text-bolivar-green hover:text-bolivar-green/80'
                  }`}
                >
                  <ArrowLeft size={20} /> Volver
                </button>
                
                <button 
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`px-10 py-4 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg ${
                    isStepValid(currentStep) 
                      ? 'bg-bolivar-green text-white hover:bg-bolivar-green/90 shadow-bolivar-green/20' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {currentStep === 6 ? 'Emitir Póliza' : 'Siguiente'} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    ) : (
      <motion.div
        key="other"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <Shield size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-bolivar-dark">Sección en Desarrollo</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            Estamos trabajando para traerte la mejor experiencia en {activeNav}. Por ahora, puedes usar la sección de Emitir.
          </p>
        </div>
        <button 
          onClick={() => setActiveNav('Emitir')}
          className="text-bolivar-green font-bold hover:underline"
        >
          Ir a Emitir Póliza
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYg5kVltAZ8AuqtHW4YR0l-0u0aEC1hFx-Hw&s" 
              alt="Seguros Bolívar" 
              className="h-10 w-auto object-contain opacity-70 grayscale hover:grayscale-0 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex gap-8 text-xs font-medium text-gray-400">
            <a href="#" className="hover:text-bolivar-green transition-colors">Términos Legales</a>
            <a href="#" className="hover:text-bolivar-green transition-colors">Privacidad</a>
            <a href="#" className="hover:text-bolivar-green transition-colors">Ayuda</a>
            <a href="#" className="hover:text-bolivar-green transition-colors">#322</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 Seguros Bolívar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
