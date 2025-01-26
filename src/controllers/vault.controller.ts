import { VaultDto } from '../dto/vault.dto';
import { IVault, IVaults } from "@interfaces/vault";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { isAddress } from "viem";
import { VaultService } from "@services/vault.service";

@Controller({ path: "vaults", version: "1" })
@ApiTags("vaults")
export class VaultController {
    public constructor(private readonly vaultService: VaultService) {}

    @Get()
    @ApiOperation({ summary: 'Get all vaults' })
    @ApiResponse({
        status: 200,
        description: 'List of all vaults',
        type: VaultDto,
        isArray: true
    })
    public getVaults(): IVaults {
        return this.vaultService.getAllVaults();
    }

    @Get(":address")
    @ApiOperation({ summary: 'Get specific vault by address' })
    @ApiResponse({
        status: 200,
        description: 'The vault information',
        type: VaultDto
    })
    @ApiResponse({ status: 404, description: 'Vault not found' })
    @ApiResponse({ status: 400, description: 'Invalid address format' })
    public getVaultFromAddress(@Param("address") address: string): IVault {
        if (!isAddress(address)) {
            throw new BadRequestException("Invalid request");
        }

        const vault: IVault | undefined = this.vaultService.getVault(address);
        if (vault !== undefined) return vault;

        throw new NotFoundException("Vault does not exist");
    }
}
