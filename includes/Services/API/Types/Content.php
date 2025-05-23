<?php
/**
 * Class Felix_Arntz\AI_Services\Services\API\Types\Content
 *
 * @since 0.1.0
 * @package ai-services
 */

namespace Felix_Arntz\AI_Services\Services\API\Types;

use Felix_Arntz\AI_Services\Services\API\Enums\Content_Role;
use Felix_Arntz\AI_Services\Services\Contracts\With_JSON_Schema;
use Felix_Arntz\AI_Services_Dependencies\Felix_Arntz\WP_OOP_Plugin_Lib\General\Contracts\Arrayable;
use InvalidArgumentException;

/**
 * Class representing an entry of content for a generative AI model.
 *
 * @since 0.1.0
 */
final class Content implements Arrayable, With_JSON_Schema {

	/**
	 * The role of the content.
	 *
	 * @since 0.1.0
	 * @var string
	 */
	private $role;

	/**
	 * The parts of the content.
	 *
	 * @since 0.1.0
	 * @var Parts
	 */
	private $parts;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 *
	 * @param string $role  The role of the content.
	 * @param Parts  $parts The parts of the content.
	 *
	 * @throws InvalidArgumentException Thrown if the given role is invalid.
	 */
	public function __construct( string $role, Parts $parts ) {
		if ( ! Content_Role::is_valid_value( $role ) ) {
			throw new InvalidArgumentException(
				sprintf(
					'The role %s is invalid.',
					htmlspecialchars( $role ) // phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
				)
			);
		}

		$this->role  = $role;
		$this->parts = $parts;
	}

	/**
	 * Gets the role of the content.
	 *
	 * @since 0.1.0
	 *
	 * @return string The role of the content.
	 */
	public function get_role(): string {
		return $this->role;
	}

	/**
	 * Gets the parts of the content.
	 *
	 * @since 0.1.0
	 *
	 * @return Parts The parts of the content.
	 */
	public function get_parts(): Parts {
		return $this->parts;
	}

	/**
	 * Returns the array representation.
	 *
	 * @since 0.1.0
	 *
	 * @return mixed[] Array representation.
	 */
	public function to_array(): array {
		return array(
			'role'  => $this->role,
			'parts' => $this->parts->to_array(),
		);
	}

	/**
	 * Creates a Content instance from an array of content data.
	 *
	 * @since 0.1.0
	 *
	 * @param array<string, mixed> $data The content data.
	 * @return Content Content instance.
	 *
	 * @throws InvalidArgumentException Thrown if the data is missing required fields.
	 */
	public static function from_array( array $data ): Content {
		if ( ! isset( $data['role'], $data['parts'] ) ) {
			throw new InvalidArgumentException( 'Content data must contain role and parts.' );
		}

		return new Content( $data['role'], Parts::from_array( $data['parts'] ) );
	}

	/**
	 * Returns the JSON schema for the expected input.
	 *
	 * @since 0.2.0
	 *
	 * @return array<string, mixed> The JSON schema.
	 */
	public static function get_json_schema(): array {
		return array(
			'type'                 => 'object',
			'properties'           => array(
				'role'  => array(
					'description' => __( 'The role of the content, i.e. which source it comes from.', 'ai-services' ),
					'type'        => 'string',
					'enum'        => array(
						Content_Role::USER,
						Content_Role::MODEL,
						Content_Role::SYSTEM,
					),
				),
				'parts' => array_merge(
					array( 'description' => __( 'Content parts, including optional multimodal input.', 'ai-services' ) ),
					Parts::get_json_schema()
				),
			),
			'additionalProperties' => false,
		);
	}
}
