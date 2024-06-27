import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue'
import { ElForm, ElMessageBox } from 'element-plus'
import axios from 'axios';
import * as DirectorioGeneralAPI from "@/api/TS_DirectorioGeneralAPI"
import * as ACOAPI from "@/api/TS_ACO"
import 'element-plus/theme-chalk/display.css';
// import moment from 'moment';


@Options({ components: {} })

export default class ViewReporteConsolidadoReserva extends Vue {

    API_ACO = new ACOAPI.TS_ACO(process.env.VUE_APP_ACO_APIURL, axios);
    API_DirectorioGeneral = new DirectorioGeneralAPI.TS_DirectorioGeneral(process.env.VUE_DirectorioGeneral_API, axios);

    public anios:ACOAPI.AniosCorteResponse[] = Array<ACOAPI.AniosCorteResponse>();
    public anio = new ACOAPI.AniosCorteResponse();

    public mesesCorte:DirectorioGeneralAPI.IItem[] = Array<DirectorioGeneralAPI.IItem>();
    public mesCorte = new DirectorioGeneralAPI.Item();

    public datos:ACOAPI.ReporteConsolidadoResponse[] = Array<ACOAPI.ReporteConsolidadoResponse>();

    public currentPage = 1;
    public pageSize = 10;

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
        // this.datos.push({nombreEntidad:"Nombre de la entidad Nombre de la entidad Nombre de la entidad",nitEntidad:"123456789111",nAfiliados:1856,nAfiliadosSalud:1000,nAfiliadosPension:1000,nAfiliadosRiesgo:1000,certificadoRLegal:2853400,valorSuficiencia:67894556,valorReferencia:7451551,observacionVRef:"Observacion Observacion Observacion Observacion Observacion Observacion Observacion ",totalRegistros:1} as ACOAPI.ReporteConsolidadoResponse);
    }

    toCurrency = (value: any) => {
        if (typeof value !== "number") {
            return value;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return formatter.format(value);
    }

    toFormat = (value: any) => {
        if (typeof value !== "number") {
            return value;
        }
        return new Intl.NumberFormat().format(value);
    }

    consultar = async (offset:number) => {
        if((this.anio.idAnio!==undefined&&this.anio.idAnio+''!=="") && (this.mesCorte.codigo!==undefined&&this.mesCorte.codigo!=="")) {
            offset = offset-1;
            this.datos = await this.API_ACO.consultarConsolidadoReporte(this.anio.idAnio, Number(this.mesCorte.codigo), offset*this.pageSize, this.pageSize);
        } else {
            alert('Por favor diligenciar los campos requeridos: Fecha Corte');
        }
    }

    exportar = async () => {
        if((this.anio.idAnio!==undefined&&this.anio.idAnio+''!=="") && (this.mesCorte.codigo!==undefined&&this.mesCorte.codigo!=="")) {
            const descarga:ACOAPI.ReporteDescargaResponse = await this.API_ACO.descargarConsolidadoReporte(this.anio.idAnio, Number(this.mesCorte.codigo));
            if(descarga.archivo) {
                const linkSource = `data:${descarga.mimetype};base64,${descarga.archivo}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = `${descarga.nombre}.${descarga.extension}`;
                downloadLink.click();
            }
        } else {
            alert('Por favor diligenciar los campos requeridos: Fecha Corte');
        }
    }

    limpiar = async() => {
        this.anio.idAnio = undefined;
        this.mesCorte.codigo = undefined;
        this.datos = Array<ACOAPI.ReporteConsolidadoResponse>();
    }
    

}