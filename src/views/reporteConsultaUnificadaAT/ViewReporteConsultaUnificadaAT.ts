import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue'
import { ElForm, ElMessageBox } from 'element-plus'
import axios from 'axios';
import * as DirectorioGeneralAPI from "@/api/TS_DirectorioGeneralAPI"
import * as ACOAPI from "@/api/TS_ACO"
import 'element-plus/theme-chalk/display.css';
// import moment from 'moment';


@Options({ components: {} })

export default class ViewReporteConsultaUnificadaAT extends Vue {

    API_ACO = new ACOAPI.TS_ACO(process.env.VUE_APP_ACO_APIURL, axios);
    API_DirectorioGeneral = new DirectorioGeneralAPI.TS_DirectorioGeneral(process.env.VUE_DirectorioGeneral_API, axios);

    public anios:ACOAPI.AniosCorteResponse[] = Array<ACOAPI.AniosCorteResponse>();
    public anio = new ACOAPI.AniosCorteResponse();

    public mesesCorte:DirectorioGeneralAPI.IItem[] = Array<DirectorioGeneralAPI.IItem>();
    public mesCorte = new DirectorioGeneralAPI.Item();
    public entidadesActivas = true;

    public datos:ACOAPI.ConsultaUnificadaATResponse[] = Array<ACOAPI.ConsultaUnificadaATResponse>();

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
        // this.datos = [];
        // this.datos.push({tipoIdEntidad: 'NI', nroIdEntidad: '900057999', nombreEntidad: 'AGREMIACION NACIONAL DE TRABAJADORES INDEPENDIENTES CON DISTINTAS PROFESIONES ARTES Y OFICIOS DIGORE', noResolucion: '3605', fechaHabilitacion: '2006-10-02', anexo240: '', rACO240Reg: '', rACO240OK: '', iMAG240: '', anexo245: 'ACO245IMAG, ACO245RACO', rACO245Reg: '1955', rACO245OK: '1955', iMAG245: 'D01, D03, D04, D02'} as ACOAPI.ConsultaUnificadaATResponse);
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
            this.datos = await this.API_ACO.consultarReporteUnificadoAT(this.anio.idAnio, Number(this.mesCorte.codigo), this.entidadesActivas, offset*this.pageSize, this.pageSize);
        } else {
            alert('Por favor diligenciar los campos requeridos: Fecha Corte');
        }
    }

    exportar = async () => {
        if((this.anio.idAnio!==undefined&&this.anio.idAnio+''!=="") && (this.mesCorte.codigo!==undefined&&this.mesCorte.codigo!=="")) {
            const descarga:ACOAPI.ReporteDescargaResponse = await this.API_ACO.descargarConsultarReporteUnificadoAT(this.anio.idAnio, Number(this.mesCorte.codigo), this.entidadesActivas);
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
        this.entidadesActivas = true;
    }
    

}