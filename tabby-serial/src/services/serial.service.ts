import { Injectable } from '@angular/core'
import SerialPort from 'serialport'
import { ProfilesService } from 'tabby-core'
import { SerialPortInfo, SerialProfile } from '../api'
import { SerialTabComponent } from '../components/serialTab.component'

@Injectable({ providedIn: 'root' })
export class SerialService {
    private constructor (
        private profilesService: ProfilesService,
    ) { }

    async listPorts (): Promise<SerialPortInfo[]> {
        return (await SerialPort.list()).map(x => ({
            name: x.path,
            description: x.manufacturer || x.serialNumber ? `${x.manufacturer || ''} ${x.serialNumber || ''}` : undefined,
        }))
    }

    quickConnect (query: string): Promise<SerialTabComponent|null> {
        let path = query
        let baudrate = 115200
        if (query.includes('@')) {
            baudrate = parseInt(path.split('@')[1])
            path = path.split('@')[0]
        }
        const profile: SerialProfile = {
            name: query,
            type: 'serial',
            options: {
                port: path,
                baudrate: baudrate,
                databits: 8,
                parity: 'none',
                rtscts: false,
                stopbits: 1,
                xany: false,
                xoff: false,
                xon: false,
            },
        }
        window.localStorage.lastSerialConnection = JSON.stringify(profile)
        return this.profilesService.openNewTabForProfile(profile) as Promise<SerialTabComponent|null>
    }
}
