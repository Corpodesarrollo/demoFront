import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue'
import { ElForm, ElMessageBox } from 'element-plus'
import axios from 'axios';
import * as DirectorioGeneralAPI from "@/api/TS_DirectorioGeneralAPI"
import * as ACOAPI from "@/api/TS_ACO"
import 'element-plus/theme-chalk/display.css';
// import moment from 'moment';


@Options({ components: {} })

export default class ViewReporteUnificadoIBCReserva extends Vue {

    API_ACO = new ACOAPI.TS_ACO(process.env.VUE_APP_ACO_APIURL, axios);
    API_DirectorioGeneral = new DirectorioGeneralAPI.TS_DirectorioGeneral(process.env.VUE_DirectorioGeneral_API, axios);
    
    public entidades:ACOAPI.EmpresaResponse[] = Array<ACOAPI.EmpresaResponse>();
    public entidad = new ACOAPI.EmpresaResponse();

    public anios:ACOAPI.AniosCorteResponse[] = Array<ACOAPI.AniosCorteResponse>();
    public anio = new ACOAPI.AniosCorteResponse();

    public mesesCorte:DirectorioGeneralAPI.IItem[] = Array<DirectorioGeneralAPI.IItem>();
    public mesCorte = new DirectorioGeneralAPI.Item();

    public datos:ACOAPI.ReporteIBCResumen1Response[] = Array<ACOAPI.ReporteIBCResumen1Response>();

    public cruce = true;

	llenarCampos = async () => {
        const items = (await this.API_DirectorioGeneral.indexGet2("PISISMesFinTrimestre")).items!;
        this.mesesCorte = items.sort(function (item1, item2) {
            return Number(item1.codigo) - Number(item2.codigo);
        });
        this.anios = await this.API_ACO.aniosCorte();
    };

    mounted(){
        this.llenarCampos();
        /*pruebas sin vpn*/
        // this.datos.push({cantidad: 500, ibcAco: 1160000, aporteSalud: 1000000, reservaSalud: 1000000, totalReservaSalud: 1000000, aportePension: 1000000, reservaPension: 1000000, totalReservaPension: 1000000, aporteRiesgo: 1000000, reservaRiesgo: 1000000, totalReservaRiesgo: 1000000, totalReservaEspecial: 1000000} as ACOAPI.ReporteIBCResumen1Response);
        // this.datos.push({cantidad: 800, ibcAco: 1160000, aporteSalud: 1000000, reservaSalud: 1000000, totalReservaSalud: 1000000, aportePension: 1000000, reservaPension: 1000000, totalReservaPension: 1000000, aporteRiesgo: 1000000, reservaRiesgo: 1000000, totalReservaRiesgo: 1000000, totalReservaEspecial: 1000000} as ACOAPI.ReporteIBCResumen1Response);
    }

    remoteMethod = async (query: string) => {
        this.entidades = await this.API_ACO.listaEmpresas(query,15);
    }

    toCurrency = (value: any) => {
        if (typeof value !== "number") {
            return value;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
        return formatter.format(value);
    }

    toFormat = (value: any) => {
        if (typeof value !== "number") {
            return value;
        }
        return new Intl.NumberFormat().format(value);
    }

    consultar = async () => {
        console.log(this.anio);
        if((this.entidad.idEmpresa!==undefined&&this.entidad.idEmpresa+''!=="") && (this.anio.idAnio!==undefined&&this.anio.idAnio+''!=="") && (this.mesCorte.codigo!==undefined&&this.mesCorte.codigo!=="")) {
            this.datos = await this.API_ACO.consultarReporte(this.entidad.idEmpresa, this.anio.idAnio, Number(this.mesCorte.codigo), this.cruce);
            if(this.datos.length == 0) {
                alert('Esta entidad no reporta 500 o mas afiliaciones con IBC del año ' + this.anio.idAnio + '. Para más detalle de las afiliaciones reportadas, por favor presionar el botón "Exportar a Excel" pestaña Detalle.');
            }
        } else {
            alert('Por favor diligenciar los campos requeridos: NIT o Razon Social de la Entidad ACO y Fecha Corte');
        }
    }

    exportar = async () => {
        if((this.entidad.idEmpresa!==undefined&&this.entidad.idEmpresa+''!=="") && (this.anio.idAnio!==undefined&&this.anio.idAnio+''!=="") && (this.mesCorte.codigo!==undefined&&this.mesCorte.codigo!=="")) {
            const descarga:ACOAPI.ReporteDescargaResponse = await this.API_ACO.descargarReporte(this.entidad.idEmpresa, this.anio.idAnio, Number(this.mesCorte.codigo), this.cruce);
            if(descarga.archivo) {
                const linkSource = `data:${descarga.mimetype};base64,${descarga.archivo}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = `${descarga.nombre}.${descarga.extension}`;
                downloadLink.click();
            }
        } else {
            alert('Por favor diligenciar los campos requeridos: NIT o Razon Social de la Entidad ACO y Fecha Corte');
        }
    }

    limpiar = async() => {
        this.entidad.idEmpresa = undefined;
        this.anio.idAnio = undefined;
        this.mesCorte.codigo = undefined;
        this.cruce = true;
        this.datos = Array<ACOAPI.ReporteIBCResumen1Response>();
    }
    

}